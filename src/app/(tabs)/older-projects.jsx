import {
  TouchableOpacity,
  SafeAreaView,
  Text,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";

const older_Projects = [
  {
    name : "Canvas on Pdf",
    url : "/Canvas-pdf"
  },
  {
    name: "MMKV Storage",
    url: "/storage",
  },
  {
    name: "Bottom Sheet Example",
    url: "/bottomSheetTest",
  },
];

export default function OlderProjects() {
  const router = useRouter();
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 }}
    >
      <Text style={{ fontSize: 20, fontWeight: "600", padding: 16 }}>
        Older Projects
      </Text>
      <FlatList
        data={older_Projects}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(item.url)}
            style={{ padding: 12, backgroundColor: "#eee", borderRadius: 10, marginVertical : 6 }}
          >
            <Text style={{ color: "#000", fontSize: 14 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
