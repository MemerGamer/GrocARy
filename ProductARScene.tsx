import React from "react";
import { StyleSheet, Platform } from "react-native";
import {
    ViroARScene,
    ViroText,
    ViroMaterials,
    ViroNode,
    ViroBox,
    ViroAnimations,
} from "@reactvision/react-viro";

interface Product {
    id: string;
    ean: string;
    fullName: string;
    brand?: string;
    imageUrl?: string;
    nutriScore?: "a" | "b" | "c" | "d" | "e";
    allergens?: string[];
    scannedAt: Date;
}

export function ProductARScene({
    product,
}: {
    product: Product | null;
}) {
    // Animation state
    const [runAnimation, setRunAnimation] = React.useState(false);

    React.useEffect(() => {
        if (product) {
            setRunAnimation(true);
        }
    }, [product]);

    const nutriColor = (g?: string) => {
        switch (g) {
            case "a": return "#1E8F4E"; // Darker green for contrast on glass
            case "b": return "#5BC236";
            case "c": return "#FFCC00";
            case "d": return "#FF8C00";
            case "e": return "#E53935";
            default: return "#CCCCCC";
        }
    };

    const prettyAllergens = (list?: string[]) =>
        (list || [])
            .map((s) => s.replace(/-/g, " ").trim())
            .join(", ");

    // Derive a “name-only” line if fullName contains brand
    const nameOnly = React.useMemo(() => {
        if (!product) return "";
        const brand = (product.brand || "").trim();
        const full = product.fullName.trim();
        if (brand && full.toLowerCase().startsWith(brand.toLowerCase())) {
            const rest = full.slice(brand.length).trim().replace(/^•\s*/, "");
            return rest || full;
        }
        return full;
    }, [product]);

    if (!product) {
        return (
            <ViroARScene>
                <ViroText
                    text={"Scanning..."}
                    position={[0, 0, -1]}
                    style={styles.loadingText}
                />
            </ViroARScene>
        );
    }

    const ns = (product.nutriScore || "?").toUpperCase();

    // REMOVED EMOJI as it might cause rendering artifacts
    const allergensText = product.allergens && product.allergens.length
        ? `Allergens: ${prettyAllergens(product.allergens)}`
        : "No Allergens Detected";

    // Text Scaling Strategy:
    // We scale the ENTIRE CARD down by 0.1x.
    // This allows us to use large layout values (meters -> decimeters) and large font sizes (points)
    // ensuring high pixel density text rendering.

    return (
        <ViroARScene>
            {/* 
                UX: Instant Placement at [0, -0.1, -0.5]
             */}
            <ViroNode
                position={[0, -0.1, -0.5]}
                animation={{ name: "popIn", run: runAnimation, loop: false }}
                dragType="FixedToWorld"
                onDrag={() => { }}
            >
                {/* 
                    PROFESSIONAL AR CARD DESIGN
                    Dimensions: 3.2m x 3.5m (32cm x 35cm scaled)
                    Procedural glassmorphism, reliable text rendering
                */}

                {/* GLASS BACKGROUND - Procedural (no image compression issues) */}
                <ViroBox
                    width={3.4}
                    height={3.5}
                    length={0.05}
                    scale={[0.1, 0.1, 0.1]}
                    materials={["glassCard"]}
                    renderingOrder={1}
                />

                {/* BRAND NAME - Top Left (Avoids Badge) */}
                <ViroText
                    text={(product.brand || "Brand").toUpperCase()}
                    position={[-0.035, 0.13, 0.06]}
                    width={2.3}
                    height={0.4}
                    scale={[0.1, 0.1, 0.1]}
                    style={styles.brandText}
                    renderingOrder={2}
                    extrusionDepth={0}
                />

                {/* PRODUCT NAME - Middle (Centered) */}
                <ViroText
                    text={nameOnly}
                    position={[0, 0.04, 0.06]}
                    width={3.0}
                    height={1.0}
                    scale={[0.1, 0.1, 0.1]}
                    maxLines={2}
                    style={styles.productNameText}
                    textLineBreakMode="WordWrap"
                    renderingOrder={2}
                    extrusionDepth={0}
                />

                {/* ALLERGENS - Lower (Centered) */}
                <ViroText
                    text={allergensText}
                    position={[0, -0.09, 0.06]}
                    width={3.0}
                    height={0.6}
                    scale={[0.1, 0.1, 0.1]}
                    maxLines={2}
                    style={styles.allergenText}
                    textLineBreakMode="WordWrap"
                    renderingOrder={2}
                    extrusionDepth={0}
                />


                {/* NUTRI-SCORE BADGE - Top Right Corner */}
                <ViroNode position={[0.12, 0.13, 0.002]}>
                    {/* Colored Box Background (Smaller, Professional) */}
                    <ViroBox
                        height={0.6}
                        width={0.6}
                        length={0.03}
                        scale={[0.1, 0.1, 0.1]}
                        materials={[nutriColor(product.nutriScore) === "#E53935" ? "nutriE" :
                            nutriColor(product.nutriScore) === "#FF8C00" ? "nutriD" :
                                nutriColor(product.nutriScore) === "#FFCC00" ? "nutriC" :
                                    nutriColor(product.nutriScore) === "#5BC236" ? "nutriB" : "nutriA"]}
                    />
                    {/* Centered Grade Letter */}
                    <ViroText
                        text={ns}
                        position={[0, 0, 0.002]}
                        width={0.6}
                        height={0.6}
                        scale={[0.1, 0.1, 0.1]}
                        style={styles.nutriText}
                        extrusionDepth={0}
                    />
                </ViroNode>
            </ViroNode>
        </ViroARScene>
    );
}

ViroMaterials.createMaterials({
    // Procedural glassmorphism (no compression issues)
    // glassCard: {
    //     diffuseColor: "rgba(30, 30, 30, 0.90)",
    //     lightingModel: "Constant",
    //     blendMode: "Alpha",
    // },

    // OPTION 2: Procedural (Code-only - No rounded corners but no asset needed)
    // Uncomment and use with ViroBox instead of ViroQuad if you want pure code approach:
    glassCard: {
        diffuseColor: "rgba(30, 30, 30, 0.90)",
        lightingModel: "Constant",
        blendMode: "Alpha",
    },

    // Nutri-Score badge colors
    nutriA: {
        diffuseColor: "#1E8F4E",
        lightingModel: "Constant",
    },
    nutriB: {
        diffuseColor: "#5BC236",
        lightingModel: "Constant",
    },
    nutriC: {
        diffuseColor: "#FFCC00",
        lightingModel: "Constant",
    },
    nutriD: {
        diffuseColor: "#FF8C00",
        lightingModel: "Constant",
    },
    nutriE: {
        diffuseColor: "#E53935",
        lightingModel: "Constant",
    },
});

ViroAnimations.registerAnimations({
    popIn: {
        properties: {
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
            opacity: 1,
        },
        easing: "Bounce",
        duration: 500,
    },
});

const styles = StyleSheet.create({
    loadingText: {
        fontSize: 30,
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "bold",
    },

    // PROFESSIONAL AR CARD TYPOGRAPHY
    brandText: {
        fontSize: 26,
        color: "rgba(255,255,255,0.75)",
        fontWeight: "600",
        textAlign: "left",
        textAlignVertical: "center",
    },
    productNameText: {
        fontSize: 50,
        color: "#FFFFFF",
        fontWeight: "bold",
        textAlign: "left",
        textAlignVertical: "top",
    },
    allergenText: {
        fontSize: 28,
        color: "#FFEEEE",
        textAlign: "left",
        textAlignVertical: "center",
    },
    nutriText: {
        fontSize: 42,
        fontWeight: "900",
        color: "#FFFFFF",
        textAlign: "center",
        textAlignVertical: "center",
    },
});