import React, { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import {
  ActivityIndicator,
  Button,
  Dimensions,
  StyleSheet,
  View,
} from "react-native";
import Pdf from "react-native-pdf";

const PdfEditor = () => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [image, setImage] = useState(null);
  const [pdfBase64, setPdfBase64] = useState(null);
  const [pdfSize, setPdfSize] = useState({ width: 0, height: 0, scale: 1 });

  const screenSize = Dimensions.get("window");

  useEffect(() => {
    (async () => {
      const pdfAsset = Asset.fromModule(require("../../assets/map.pdf"));
      await pdfAsset.downloadAsync();
      const pdfBytes = await FileSystem.readAsStringAsync(pdfAsset.localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const doc = await PDFDocument.load(
        Uint8Array.from(atob(pdfBytes), (c) => c.charCodeAt(0))
      );
      setPdfDoc(doc);

      const imageAsset = Asset.fromModule(
        require("../../assets/images/marker.png")
      );
      await imageAsset.downloadAsync();
      const imgBase64 = await FileSystem.readAsStringAsync(imageAsset.localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const img = await doc.embedPng(imgBase64);
      setImage(img);

      const b64 = await doc.saveAsBase64();
      setPdfBase64(b64);
    })();
  }, []);

  const handleTap = async (x, y) => {
    console.log({x, y})
    if (!pdfBase64 || !image || !pdfSize.width) return;
  
    // Load fresh PDF from the current base64 state
    const doc = await PDFDocument.load(
      Uint8Array.from(atob(pdfBase64), (c) => c.charCodeAt(0))
    );
  
    const page = doc.getPages()[0];
    const imageWidth = 30;
    const imageHeight = 30;
    console.log(page.getHeight(), page.getWidth());
  
    console.log("X", page.getCropBox());
    console.log("Y", page.getY());


    const pdfX = x / page.getX();
    const pdfY = page.height - y / page;

    console.log({width : page.getWidth() - x , height : page.getHeight() - y});
  
    page.drawImage(image, {
      x: x,
      y: page.getHeight() - y,
      width: imageWidth,
      height: imageHeight,
    });
  
    const updatedBase64 = await doc.saveAsBase64();
    setPdfBase64(updatedBase64);
  };

  const handleSave = async () => {
    if (!pdfBase64) return;
    const uri = FileSystem.documentDirectory + "final.pdf";
    await FileSystem.writeAsStringAsync(uri, pdfBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("Saved to:", uri);
  };

  if (!pdfBase64) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Pdf
      enableDoubleTapZoom={false}
        source={{ uri: `data:application/pdf;base64,${pdfBase64}` , cache : false}}
        onLoadComplete={(pages, filePath, { width, height }) => {
          const scale = Math.min(screenSize.width / width, screenSize.height / height);
          setPdfSize({ width, height, scale });
        }}
        onPageSingleTap={(page, x, y) => {
          handleTap(x, y);
        }}
        style={{
          flex: 1,
          width: pdfSize.width * pdfSize.scale,
          height: pdfSize.height * pdfSize.scale,
          alignSelf: "center",
        }}
        scale={pdfSize.scale}
      />
      <View style={styles.controls}>
        <Button title="Save PDF" onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    padding: 10,
    backgroundColor: "#fff",
  },
});

export default PdfEditor;
