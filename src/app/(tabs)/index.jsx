import {
  Button,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";
import * as Keychain from "react-native-keychain";
import axios from "axios";

export default function HomeScreen() {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [fingerprint, setFingerprint] = useState(false);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);

  async function storeTheCredentials() {
    console.log("called to store the credentials");
    await Keychain.setGenericPassword(userName, password, {
      service: "com.jaiminrathwa28.myapp.auth.jwt",
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      authenticationPrompt: {
        title: "Authenticate to store your credentials",
      },
    });
  }

  async function loginUser(username, pass) {
    try {
      const response = await axios.post(
        "https://sentrysafety.online/v1/api/auth/login",
        {
          userName: username,
          password: pass,
        }
      );

      const data = response?.data;
      // console.log({data});
      setLoggedIn(true);

      if (!fingerprint) await storeTheCredentials();
      return { success: true, data };
    } catch (error) {
      await Keychain.resetGenericPassword();

      setFingerprint(false);
      return {
        success: false,
        error: {
          message: error?.response?.data || "Something went wrong",
          status: error?.response?.status || 500,
        },
      };
    }
  }

  const handleGetCredentialsFromKeyChain = async () => {
    const isPasscode = await Keychain.isPasscodeAuthAvailable();

    const hasCreds = await Keychain.hasGenericPassword({
      service: "com.jaiminrathwa28.myapp.auth.jwt",
    });

    console.log("====================================");
    console.log({ hasCreds });
    console.log("====================================");

    if (hasCreds) {
      const creds = await Keychain.getGenericPassword({
        service: "com.jaiminrathwa28.myapp.auth.jwt",
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        authenticationPrompt: {
          title: "Authenticate using your fingerPrint",
        },
      });
      console.log("Stored JWT:", creds);

      if (creds.username && creds.password) {
        await loginUser(creds.username, creds.password);
      }
    }
  };

  const handleBiometricAuthentication = async () => {
    try {
      // const biometricAuth = await LocalAuthentication.authenticateAsync({
      //   promptMessage: "Login with Biometrics",
      //   disableDeviceFallback: true,
      //   cancelLabel: "Cancel",
      // });
      // console.log({ biometricAuth });
      // if (biometricAuth.success) {

      // }
      await handleGetCredentialsFromKeyChain();
    } catch (error) {
      console.log(error);
    }
  };

  const localAuthenticationFunc = async () => {
    console.log("herere");
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (compatible) {
      setIsBiometricSupported(true);
    }

    const enroll = await LocalAuthentication.isEnrolledAsync();

    if (enroll && compatible) return true;
    else return false;
  };

  useEffect(() => {
    const checkIfCredsAvailable = async () => {
      const hasCreds = await Keychain.hasGenericPassword({
        service: "com.jaiminrathwa28.myapp.auth.jwt",
      });

      const isBiometricAvailable = localAuthenticationFunc();

      if (hasCreds && isBiometricAvailable) {
        setFingerprint(true);
      }
    };

    checkIfCredsAvailable();
  });
  return (
    <SafeAreaView
      style={{
        display: "flex",
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 200,
      }}
    >
      <View style={{ padding: 20, rowGap: 12 }}>
        {loggedIn && (
          <Text
            style={{ fontSize: 30, color: "green", marginHorizontal: "auto" }}
          >
            You Are Logged In !!
          </Text>
        )}
        <View style={{ rowGap: 4 }}>
          <Text>UserName</Text>
          <TextInput
            key="username"
            textContentType="username"
            style={{
              borderWidth: 1,
              borderRadius: 12,
              padding: 12,
              paddingVertical: 10,
            }}
            onChangeText={setUserName}
            inputMode="text"
          />
        </View>

        <View style={{ rowGap: 4 }}>
          <Text>Password</Text>
          <TextInput
            key="password"
            textContentType="password"
            secureTextEntry={true}
            style={{
              borderWidth: 1,
              borderRadius: 12,
              padding: 12,
              paddingVertical: 10,
            }}
            onChangeText={setPassword}
            inputMode="text"
            keyboardType="visible-password"
          />
        </View>
        <TouchableOpacity
          onPress={() => loginUser(userName, password)}
          style={{
            padding: 12,
            borderRadius: 4,
            backgroundColor: "#eee",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#111" }}>Login</Text>
        </TouchableOpacity>
      </View>

      {fingerprint && (
        <Button
          title="Check for Bio Metric"
          // onPress={() => LocalAuthenticationFunc()}
          onPress={() => handleBiometricAuthentication()}
        />
      )}

      {loggedIn && <Button title="LogOut" onPress={() => setLoggedIn(false)} />}
    </SafeAreaView>
  );
}
