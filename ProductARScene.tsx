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
            case "a": return "#1E8F4E";
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
                position={[0, -0.1, -0.5]} // Place 0.5m in front
                animation={{ name: "popIn", run: runAnimation, loop: false }}
                dragType="FixedToWorld"
                onDrag={() => { }}
            >
                {/* 
                    Main Container Card
                    Dimensions: 4m x 5m (scaled down by 0.1 -> 40cm x 50cm visual size)
                    Using ViroFlexView for Layout
                */}
                <ViroFlexView
                    width={4.0}
                    height={5.0}
                    scale={[0.1, 0.1, 0.1]}
                    style={styles.cardContainer}
                    materials={["glassCard"]}
                >
                    {/* Header: Brand and Product Name */}
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

                    {/* Data Grid: NutriScore + Info */}
                    <ViroFlexView style={styles.gridContainer} width={3.8} height={1.2}>
                        {/* Cell 1: NutriScore Badge */}
                        <ViroFlexView style={styles.gridCell} width={1.2} height={1.2}>
                            <ViroBox
                                height={1.0}
                                width={1.0}
                                length={0.05}
                                materials={[nutriColor(product.nutriScore) === "#E53935" ? "nutriE" :
                                    nutriColor(product.nutriScore) === "#FF8C00" ? "nutriD" :
                                        nutriColor(product.nutriScore) === "#FFCC00" ? "nutriC" :
                                            nutriColor(product.nutriScore) === "#5BC236" ? "nutriB" : "nutriA"]}
                            />
                            <ViroText
                                text={ns}
                                position={[0, 0, 0.06]}
                                width={1.0}
                                height={1.0}
                                style={styles.nutriText}
                            />
                        </ViroFlexView>

                        {/* Cell 2: General Info / Scanned Date */}
                        <ViroFlexView style={styles.gridCellLeft} width={2.6} height={1.2}>
                            <ViroText
                                text={"Scanned Now"}
                                width={2.5}
                                height={0.5}
                                style={styles.infoLabel}
                            />
                            <ViroText
                                text={new Date().toLocaleTimeString()}
                                width={2.5}
                                height={0.5}
                                style={styles.infoValue}
                            />
                        </ViroFlexView>
                    </ViroFlexView>

                    {/* Details Section: Allergens & Ingredients */}
                    <ViroFlexView style={styles.detailsContainer} width={3.8} height={2.4}>
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
                            height={1.0}
                            style={styles.smallText}
                            maxLines={3}
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
        fontSize: 30,
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "bold",
    },
    cardContainer: {
        flexDirection: "column",
        padding: 0.1,
        backgroundColor: "rgba(20,20,20,0.9)",
    },
    headerContainer: {
        flexDirection: "column",
        marginBottom: 0.1,
    },
    gridContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 0.1,
    },
    gridCell: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    gridCellLeft: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingLeft: 0.2,
    },
    detailsContainer: {
        flexDirection: "column",
    },
    brandText: {
        fontSize: 24,
        color: "rgba(255,255,255,0.7)",
        fontWeight: "600",
        textAlign: "left",
        textAlignVertical: "center",
    },
    productNameText: {
        fontSize: 40,
        color: "#FFFFFF",
        fontWeight: "bold",
        textAlign: "left",
        textAlignVertical: "top",
    },
    nutriText: {
        fontSize: 50,
        fontWeight: "900",
        color: "#FFFFFF",
        textAlign: "center",
        textAlignVertical: "center",
    },
    infoLabel: {
        fontSize: 18,
        color: "#AAAAAA",
        textAlign: "left",
    },
    infoValue: {
        fontSize: 24,
        color: "#FFFFFF",
        fontWeight: "bold",
        textAlign: "left",
    },
    sectionHeader: {
        fontSize: 20,
        color: "#AAAAAA",
        fontWeight: "600",
        textAlign: "left",
        marginTop: 0.1,
    },
    sometText: {
        fontSize: 22,
        color: "#FFEEEE",
        textAlign: "left",
    },
    smallText: {
        fontSize: 18,
        color: "#DDDDDD",
        textAlign: "left",
    },
});