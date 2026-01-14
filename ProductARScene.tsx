import React from "react";
import { StyleSheet, Platform } from "react-native";
import {
    ViroARScene,
    ViroText,
    ViroMaterials,
    ViroNode,
    ViroBox,
    ViroFlexView,
    ViroAnimations,
} from "@reactvision/react-viro";

interface Product {
    id: string;
    ean: string;
    fullName: string;
    brand?: string;
    quantity?: string;
    imageUrl?: string;
    nutriScore?: "a" | "b" | "c" | "d" | "e";
    allergens?: string[];
    ingredientsText?: string;
    nutrientLevels?: Record<string, string>;
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
            case "a": return "nutriA";
            case "b": return "nutriB";
            case "c": return "nutriC";
            case "d": return "nutriD";
            case "e": return "nutriE";
            default: return "glassCard";
        }
    };

    const prettyAllergens = (list?: string[]) =>
        (list || [])
            .map((s) => s.replace(/-/g, " ").trim())
            .join(", ");

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

    // Formatting display text
    const allergensStr = product.allergens && product.allergens.length
        ? `${prettyAllergens(product.allergens)}`
        : "No Allergens Detected";

    const ingredientsStr = product.ingredientsText
        ? product.ingredientsText.slice(0, 150) + (product.ingredientsText.length > 150 ? "..." : "")
        : "Ingredients not available";

    return (
        <ViroARScene>
            <ViroNode
                position={[0, -0.1, -0.5]}
                animation={{ name: "popIn", run: runAnimation, loop: false }}
                dragType="FixedToWorld"
                onDrag={() => { }}
            >
                <ViroFlexView
                    width={4.0}
                    height={5.0} // Increased height to fit footer
                    scale={[0.1, 0.1, 0.1]}
                    style={styles.cardContainer}
                    materials={["glassCard"]}
                >
                    {/* Header */}
                    <ViroFlexView style={styles.headerContainer} width={3.8} height={1.2}>
                        <ViroText
                            text={(product.brand || "Brand").toUpperCase()}
                            width={3.8}
                            height={0.4}
                            style={styles.brandText}
                        />
                        <ViroText
                            text={nameOnly}
                            width={3.8}
                            height={0.8}
                            style={styles.productNameText}
                            maxLines={2}
                        />
                    </ViroFlexView>

                    {/* Middle: Nutri-Score & Quantity */}
                    <ViroFlexView style={styles.gridContainer} width={3.8} height={1.2}>
                        {/* NutriScore Badge - Container IS the colored box */}
                        <ViroFlexView
                            style={styles.nutriBadge}
                            width={1.0}
                            height={1.0}
                            materials={[nutriColor(product.nutriScore)]}
                        >
                            <ViroText
                                text={ns}
                                width={1.0}
                                height={1.0}
                                style={styles.nutriText}
                            />
                        </ViroFlexView>

                        {/* Quantity Info */}
                        <ViroFlexView style={styles.gridCellLeft} width={2.6} height={1.2}>
                            <ViroText
                                text={"Quantity / Size"}
                                width={2.5}
                                height={0.5}
                                style={styles.infoLabel}
                            />
                            <ViroText
                                text={product.quantity || "N/A"}
                                width={2.5}
                                height={0.5}
                                style={styles.infoValue}
                            />
                        </ViroFlexView>
                    </ViroFlexView>

                    {/* Details: Allergens & Ingredients */}
                    <ViroFlexView style={styles.detailsContainer} width={3.8} height={2.2}>
                        <ViroText
                            text="Allergens:"
                            width={3.8}
                            height={0.4}
                            style={styles.sectionHeader}
                        />
                        <ViroText
                            text={allergensStr}
                            width={3.8}
                            height={0.6}
                            style={styles.sometText}
                            maxLines={2}
                        />

                        <ViroText
                            text="Ingredients:"
                            width={3.8}
                            height={0.4}
                            style={styles.sectionHeader}
                        />
                        <ViroText
                            text={ingredientsStr}
                            width={3.8}
                            height={0.8}
                            style={styles.smallText}
                            maxLines={3}
                        />
                    </ViroFlexView>

                    {/* Footer: Scanned Time */}
                    <ViroFlexView style={styles.footerContainer} width={3.8} height={0.3}>
                        <ViroText
                            text={`Scanned: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                            width={3.8}
                            height={0.3}
                            style={styles.footerText}
                        />
                    </ViroFlexView>

                </ViroFlexView>
            </ViroNode>
        </ViroARScene>
    );
}

ViroMaterials.createMaterials({
    glassCard: {
        diffuseColor: "rgba(20, 20, 20, 0.90)",
        lightingModel: "Constant",
        blendMode: "Alpha",
    },
    nutriA: { diffuseColor: "#1E8F4E", lightingModel: "Constant" },
    nutriB: { diffuseColor: "#5BC236", lightingModel: "Constant" },
    nutriC: { diffuseColor: "#FFCC00", lightingModel: "Constant" },
    nutriD: { diffuseColor: "#FF8C00", lightingModel: "Constant" },
    nutriE: { diffuseColor: "#E53935", lightingModel: "Constant" },
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
        fontSize: 30, color: "#FFFFFF", textAlign: "center", fontWeight: "bold",
    },
    cardContainer: {
        flexDirection: "column",
        padding: 0.1,
        backgroundColor: "rgba(20,20,20,0.9)",
    },
    headerContainer: {
        flexDirection: "column", marginBottom: 0.1,
    },
    gridContainer: {
        flexDirection: "row", alignItems: "center", marginBottom: 0.1,
    },
    nutriBadge: {
        flexDirection: "column", alignItems: "center", justifyContent: "center",
    },
    gridCellLeft: {
        flexDirection: "column", alignItems: "flex-start", justifyContent: "center", paddingLeft: 0.2,
    },
    detailsContainer: {
        flexDirection: "column", marginBottom: 0.1,
    },
    footerContainer: {
        flexDirection: "column", justifyContent: "flex-end",
    },
    brandText: {
        fontSize: 24, color: "rgba(255,255,255,0.7)", fontWeight: "600", textAlign: "left", textAlignVertical: "center",
    },
    productNameText: {
        fontSize: 36, color: "#FFFFFF", fontWeight: "bold", textAlign: "left", textAlignVertical: "top",
    },
    nutriText: {
        fontSize: 60, fontWeight: "900", color: "#FFFFFF", textAlign: "center", textAlignVertical: "center",
    },
    infoLabel: {
        fontSize: 18, color: "#AAAAAA", textAlign: "left",
    },
    infoValue: {
        fontSize: 24, color: "#FFFFFF", fontWeight: "bold", textAlign: "left",
    },
    sectionHeader: {
        fontSize: 18, color: "#AAAAAA", fontWeight: "600", textAlign: "left", marginBottom: 0.05,
    },
    sometText: {
        fontSize: 20, color: "#FFEEEE", textAlign: "left", textAlignVertical: "top",
    },
    smallText: {
        fontSize: 16, color: "#DDDDDD", textAlign: "left", textAlignVertical: "top",
    },
    footerText: {
        fontSize: 14, color: "#666666", textAlign: "center", textAlignVertical: "center",
    }
});