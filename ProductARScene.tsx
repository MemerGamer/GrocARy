import React from "react";
import { StyleSheet } from "react-native";
import {
    ViroARScene,
    ViroText,
    ViroBox,
    ViroMaterials,
    ViroNode,
    ViroPolyline,
    ViroFlexView,
    ViroARPlaneSelector,
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
    const [placed, setPlaced] = React.useState(false);

    // Keep the label above the anchor (don’t scale text; keep it close)
    const labelOffset = React.useMemo<[number, number, number]>(() => {
        return [0, 0.22, 0];
    }, []);

    const nutriColor = (g?: string) => {
        switch (g) {
            case "a":
                return "#11A611";
            case "b":
                return "#5BC236";
            case "c":
                return "#FFCC00";
            case "d":
                return "#FF8C00";
            case "e":
                return "#E53935";
            default:
                return "#E0E0E0";
        }
    };

    const prettyAllergens = (list?: string[]) =>
        (list || [])
            .map((s) =>
                s
                    .replace(/\b\w/g, (m) => m.toUpperCase())
                    .replace(/-/g, " ")
                    .trim()
            )
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

    const LabelPanel = () => {
        if (!product) return null;

        const ns = (product.nutriScore || "N/A").toUpperCase();
        const allergensText =
            product.allergens && product.allergens.length
                ? `Allergens: ${prettyAllergens(product.allergens)}`
                : "Allergens: —";

        return (
            <>
                {/* Leader line from anchor to panel */}
                <ViroPolyline
                    points={[
                        [0, 0.03, 0],
                        [labelOffset[0], labelOffset[1] - 0.03, labelOffset[2]],
                    ]}
                    thickness={0.003}
                    materials={["lineGray"]}
                />

                {/* Column layout: Brand, Name, Allergens, Nutri-Score */}
                <ViroFlexView
                    position={labelOffset}
                    width={0.2}
                    height={0.18}
                    materials={["panelBg"]}
                    style={styles.panel}
                    transformBehaviors={["billboardY"]}
                >
                    {/* Brand */}
                    <ViroText
                        text={product.brand || "—"}
                        style={styles.brandText}
                        scale={[0.05, 0.05, 0.05]}
                        textClipMode="None"
                        outerStroke={{ type: "Outline", width: 2, color: "#000000" }}
                    />

                    {/* Name */}
                    <ViroText
                        text={nameOnly}
                        style={styles.nameText}
                        scale={[0.05, 0.05, 0.05]}
                        textClipMode="None"
                        outerStroke={{ type: "Outline", width: 2, color: "#000000" }}
                    />

                    {/* Allergens */}
                    <ViroText
                        text={allergensText}
                        style={styles.infoText}
                        scale={[0.05, 0.05, 0.05]}
                        textClipMode="None"
                        outerStroke={{ type: "Outline", width: 2, color: "#000000" }}
                    />

                    {/* Nutri-Score */}
                    <ViroText
                        text={`Nutri-Score: ${ns}`}
                        style={styles.infoText}
                        color={nutriColor(product.nutriScore)}
                        scale={[0.05, 0.05, 0.05]}
                        textClipMode="None"
                        outerStroke={{ type: "Outline", width: 2, color: "#000000" }}
                    />
                </ViroFlexView>
            </>
        );
    };

    const AnchoredContent = () => (
        <ViroNode position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}>
            {/* Anchor base marker */}
            <ViroBox
                position={[0, 0.01, 0]}
                scale={[0.06, 0.001, 0.06]}
                materials={["anchorBase"]}
            />
            {LabelPanel()}
        </ViroNode>
    );

    return (
        <ViroARScene anchorDetectionTypes={["PlanesHorizontal", "PlanesVertical"]}>
            {!product ? (
                <ViroText
                    text={"Scan a product first"}
                    position={[0, 0, -1.2]}
                    style={styles.instructionText}
                    outerStroke={{ type: "Outline", width: 2, color: "#000" }}
                />
            ) : (
                <>
                    {!placed && (
                        <>
                            <ViroText
                                text={"Move phone to find a surface, then tap to place"}
                                position={[0, 0, -1]}
                                style={styles.instructionText}
                                outerStroke={{ type: "Outline", width: 2, color: "#000" }}
                            />
                            <ViroARPlaneSelector
                                onPlaneSelected={() => {
                                    console.log("Plane selected: placed anchored content");
                                    setPlaced(true);
                                }}
                            >
                                <AnchoredContent />
                            </ViroARPlaneSelector>
                        </>
                    )}
                    {placed && <AnchoredContent />}
                </>
            )}
        </ViroARScene>
    );
}

ViroMaterials.createMaterials({
    panelBg: { diffuseColor: "rgba(0,0,0,0.85)", lightingModel: "Constant" },
    anchorBase: { diffuseColor: "rgba(255,255,255,0.7)", lightingModel: "Constant" },
    lineGray: { diffuseColor: "#AAAAAA", lightingModel: "Constant" },
});

const styles = StyleSheet.create({
    instructionText: {
        fontSize: 18,
        color: "#FFFFFF",
        textAlign: "center",
        backgroundColor: "rgba(0,0,0,0.8)",
        fontWeight: "bold",
    },
    panel: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        // padding: 0.01,
    } as any,
    brandText: {
        fontSize: 30,
        color: "#FFFFFF",
        textAlign: "center",
        textAlignVertical: "center",
        fontWeight: "700",
    },
    nameText: {
        fontSize: 30,
        color: "#FFFFFF",
        textAlign: "center",
        textAlignVertical: "center",
        fontWeight: "700",
    },
    infoText: {
        fontSize: 30,
        color: "#FFFFFF",
        textAlign: "center",
        textAlignVertical: "center",
    },
});