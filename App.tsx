import React, { useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { ViroARSceneNavigator } from "@reactvision/react-viro";
import { ProductARScene } from "./ProductARScene";

type AppMode = "SCANNING" | "AR_VIEW";

interface ProductOFF {
  name?: string;
  brand?: string;
  quantity?: string;
  nutriScore?: "a" | "b" | "c" | "d" | "e";
  allergens?: string[];
  imageUrl?: string;
}

interface Product {
  id: string;
  ean: string;
  fullName: string;
  brand?: string;
  imageUrl?: string;
  nutriScore?: ProductOFF["nutriScore"];
  allergens?: string[];
  scannedAt: Date;
}

export default function HybridGroceryApp() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");

  const [appMode, setAppMode] = useState<AppMode>("SCANNING");
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const lastScannedEAN = useRef<string>("");
  const scanCooldown = useRef<boolean>(false);

  const codeScanner = useCodeScanner({
    codeTypes: ["ean-8", "ean-13"],
    onCodeScanned: (codes) => {
      if (codes.length === 0 || scanCooldown.current) return;

      const barcode = codes[0];
      const ean = barcode.value ?? "";
      if (!ean || ean === lastScannedEAN.current) return;

      scanCooldown.current = true;
      lastScannedEAN.current = ean;

      console.log("Scanned EAN:", ean);
      void handleProductLookup(ean);

      setTimeout(() => {
        scanCooldown.current = false;
      }, 900);
    },
  });

  const handleProductLookup = async (ean: string) => {
    try {
      const off = await fetchOpenFoodFacts(ean);
      const fullName = buildFullName(off);

      const product: Product = {
        id: Date.now().toString(),
        ean,
        fullName,
        brand: off.brand,
        imageUrl: off.imageUrl,
        nutriScore: off.nutriScore,
        allergens: off.allergens,
        scannedAt: new Date(),
      };

      console.log("OFF product:", {
        name: off.name,
        brand: off.brand,
        nutriScore: off.nutriScore,
        allergens: off.allergens?.slice(0, 5),
      });

      setCurrentProduct(product);
      setTimeout(() => setAppMode("AR_VIEW"), 300);
    } catch (e) {
      console.warn("OpenFoodFacts lookup failed:", e);
      setCurrentProduct({
        id: Date.now().toString(),
        ean,
        fullName: "Unknown Product",
        scannedAt: new Date(),
      });
      setTimeout(() => setAppMode("AR_VIEW"), 300);
    }
  };

  function buildFullName(p: ProductOFF): string {
    const parts = [p.brand, p.name, p.quantity].filter(Boolean);
    return parts.join(" • ") || "Unknown Product";
  }

  async function fetchOpenFoodFacts(ean: string): Promise<ProductOFF> {
    const url = `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(
      ean
    )}.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OFF HTTP ${res.status}`);
    const json = await res.json();
    if (json.status !== 1 || !json.product) return {};

    const prod = json.product;
    const lang = prod.lang || prod.lc || "en";
    const byLangKey = (k: string) =>
      prod[`${k}_${lang}`] ||
      prod[`${k}_en`] ||
      prod[`${k}_de`] ||
      prod[`${k}_fr`] ||
      prod[`${k}_it`] ||
      prod[k];

    const name: string | undefined =
      (byLangKey("product_name") as string | undefined)?.trim() ||
      (byLangKey("generic_name") as string | undefined)?.trim();

    const brand: string | undefined =
      (prod.brands && String(prod.brands).split(",")[0].trim()) || undefined;

    const quantity: string | undefined =
      (prod.quantity && String(prod.quantity).trim()) ||
      (prod.product_quantity && prod.product_quantity_unit
        ? `${prod.product_quantity}${prod.product_quantity_unit}`
        : undefined);

    const nutriScore: ProductOFF["nutriScore"] =
      (prod.nutriscore_grade as any) || undefined;

    const allergens: string[] | undefined =
      (prod.allergens_tags as string[] | undefined)?.map((t) =>
        t.replace(/^..:/, "").replace(/-/g, " ")
      ) ||
      (prod.allergens
        ? String(prod.allergens)
          .split(/[;,]/)
          .map((s: string) => s.trim())
          .filter(Boolean)
        : undefined);

    const imageUrl: string | undefined =
      prod.image_front_url ||
      prod.image_url ||
      (prod.selected_images &&
        prod.selected_images.front &&
        prod.selected_images.front.display &&
        (prod.selected_images.front.display[lang] ||
          prod.selected_images.front.display.en));

    return { name, brand, quantity, nutriScore, allergens, imageUrl };
  }

  React.useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  if (!hasPermission || device == null) return null;

  return (
    <View style={styles.container}>
      {appMode === "SCANNING" ? (
        <View style={styles.scanningContainer}>
          <Camera
            style={StyleSheet.absoluteFillObject}
            device={device}
            isActive={true}
            codeScanner={codeScanner}
          />

          <View style={styles.scanningOverlay}>
            <Text style={styles.scanningText}>
              Point camera at product barcode
            </Text>

            <View style={styles.focusFrame}>
              <View style={styles.focusCorner} />
              <View style={[styles.focusCorner, styles.topRight]} />
              <View style={[styles.focusCorner, styles.bottomLeft]} />
              <View style={[styles.focusCorner, styles.bottomRight]} />
            </View>

            {currentProduct && (
              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => setAppMode("AR_VIEW")}
              >
                <Text style={styles.buttonText}>
                  View in AR: {currentProduct.fullName}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.arContainer}>
          <ViroARSceneNavigator
            initialScene={{ scene: () => (
              <ProductARScene product={currentProduct} />
            ) }}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.arControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                setAppMode("SCANNING");
                setCurrentProduct(null);
                lastScannedEAN.current = "";
                scanCooldown.current = false;
                console.log("Back to scanning");
              }}
            >
              <Text style={styles.buttonText}>Scan New</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  scanningContainer: { flex: 1 },
  scanningOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  scanningText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 50,
  },
  focusFrame: { width: 200, height: 200, position: "relative" },
  focusCorner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "lime",
    borderWidth: 3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    left: undefined,
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    top: undefined,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    top: undefined,
    left: undefined,
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  switchButton: {
    position: "absolute",
    bottom: 100,
    backgroundColor: "rgba(0,255,0,0.8)",
    padding: 15,
    borderRadius: 10,
    maxWidth: "80%",
  },
  arContainer: { flex: 1 },
  arControls: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  controlButton: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 15,
    borderRadius: 10,
    minWidth: 110,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { fontSize: 16, fontWeight: "bold", color: "black" },
});