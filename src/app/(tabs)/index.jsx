import React, { useCallback, useState } from "react";
import { View, Button, StyleSheet, Dimensions, Pressable } from "react-native";
import Pdf from "react-native-pdf";
import {
  Canvas,
  Image,
  useImage,
  FilterMode,
  MipmapMode,
} from "@shopify/react-native-skia";
import { SafeAreaView } from "react-native-web";

const screen = Dimensions.get("window");

export default function HomeScreen() {
  const [points, setPoints] = useState([]);
  const [scale, setScale] = useState(1);
  const [pdfSize, setPdfSize] = useState({ width: 0, height: 0 });
  const image = useImage(require("../../assets/images/marker.png"));

  const handlePdfLoad = (width, height) => {
    setPdfSize({ width, height });
  };

  console.log({ points });

  const handlePdfTap = (x, y) => {
    const pdfX = x / scale;
    const pdfY = y / scale;
    setPoints((prev) => [...prev, { x: pdfX, y: pdfY }]);
  };

  const navigatePoint = useCallback((direction) => {
    setScale((prev) =>
      direction === "+" ? prev + 0.1 : Math.max(1, prev - 0.1)
    );
  }, []);

  // To check username

  return (
    <View style={styles.container}>
      <View style={styles.pdfWrapper}>
        <Pdf
          source={require("../../assets/map.pdf")}
          page={1}
          style={styles.pdf}
          scale={scale}
          onLoadComplete={(pages, path, { width, height }) =>
            handlePdfLoad(width, height)
          }
          // singlePage={true}
        />

        {/* Absolute overlay for touch + Skia */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={(e) => {
            const { locationX, locationY } = e.nativeEvent;
            handlePdfTap(locationX, locationY);
          }}
        >
          <Canvas style={StyleSheet.absoluteFill}>
            {points.map((point, index) =>
              image ? (
                <Image
                  key={index}
                  image={image}
                  x={point.x * scale - 12.5}
                  y={point.y * scale + 12.5}
                  width={25}
                  height={25}
                />
              ) : null
            )}
          </Canvas>
        </Pressable>
      </View>

      <View style={styles.controls}>
        <Button title="-" onPress={() => navigatePoint("-")} />
        <Button title="+" onPress={() => navigatePoint("+")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ababab",
  },
  pdfWrapper: {
    flex: 1,
    maxHeight: "80%",
    position: "relative",
  },
  pdf: {
    flex :1,
    backgroundColor: "#ab2",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#fff",
  },
});
