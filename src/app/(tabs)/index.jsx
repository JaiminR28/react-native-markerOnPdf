import React, { useCallback, useState } from "react";
import {
  View,
  Button,
  StyleSheet,
  Dimensions,
  Pressable,
  SafeAreaView,
  Text,
} from "react-native";
import Pdf from "react-native-pdf";
import { Canvas, Image, useImage } from "@shopify/react-native-skia";

const screen = Dimensions.get("window");

export default function HomeScreen() {
  const [points, setPoints] = useState([]);
  const [scale, setScale] = useState(1);
  const [pdfSize, setPdfSize] = useState({ width: 0, height: 0 });
  const [newPointActive, setNewPointActive] = useState(false);
  const [newPointCoords, setNewPointCoords] = useState(null);
  const image = useImage(require("../../assets/images/marker.png"));

  const handlePdfLoad = (width, height) => {
    setPdfSize({ width, height });
  };

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
    <SafeAreaView style={styles.container}>
      {newPointActive && (
        <View
          style={{
            height: 30,
            paddingHorizontal: 12,
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#FBDFB1",
            //   justifyContent: "space-between",
          }}
        >
          <View className="flex-row flex-1">
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="ml-3 text-xs flex-row gap-x-2 w-[90%]"
            >
              <Text className=" text-[#693D11] font-medium">
                Top on the map once to add the marker
              </Text>
            </Text>
          </View>
        </View>
      )}
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
        {newPointActive ? (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={(e) => {
              const { locationX, locationY } = e.nativeEvent;
              const pdfX = locationX / scale;
              const pdfY = locationY / scale;
              setNewPointCoords({ x: pdfX, y: pdfY });
              // handlePdfTap(locationX, locationY);
            }}
          >
            <Canvas
            pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                // {backgroundColor : "red"}
              ]}
            >
              {newPointCoords &&
                  image ? (
                    <Image
                      image={image}
                      x={newPointCoords.x * scale - 12.5}
                      y={newPointCoords.y * scale + 12.5}
                      width={25}
                      height={25}
                    />
                  ) : null
                }
            </Canvas>
          </Pressable>
        ) : (
          <Canvas
          pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              // {backgroundColor : "red"}
            ]}
          >
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
        )}
      </View>

      <View style={styles.controls}>
        <Button title="-" onPress={() => navigatePoint("-")} />
        <Button title="+" onPress={() => navigatePoint("+")} />

        {newPointActive ? (
          newPointCoords ? (
            <>
              <Button title="Undo" onPress={() => setNewPointCoords(null)} />
              <Button
                title="Save"
                onPress={() => {
                  setPoints((prev) => [...prev, { ...newPointCoords }]);
                  setNewPointCoords(null);
                  setNewPointActive(false);
                }}
              />
            </>
          ) : null
        ) : (
          <Button
            title="Set New Point Active"
            onPress={() => setNewPointActive(true)}
          />
        )}
      </View>
    </SafeAreaView>
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
    flex: 1,
    backgroundColor: "#ab2",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#fff",
  },
});