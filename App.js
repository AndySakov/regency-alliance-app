import {
  StyleSheet,
  View,
  useWindowDimensions,
  BackHandler,
  Platform,
  Text,
  Image,
} from "react-native";
import WebView from "react-native-webview";
import { Bar } from "react-native-progress";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import React, { useEffect, useState, useRef } from "react";
import Button from "react-native-pure-button";
import homeIcon from "./assets/icons/home.png";
import reloadIcon from "./assets/icons/reload.png";

export default function App() {
  const { height, width } = useWindowDimensions();
  const [key, setKey] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [urlChanged, setUrlChanged] = useState(false);

  const webViewRef = useRef(null);

  const back = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    return false;
  };

  const reload = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
      return true;
    }
    return false;
  };

  const home = () => {
    if (urlChanged) {
      setKey(key + 1);
      setUrlChanged(false);
    }
  };

  const defaultURL = "https://ebsandbox.regencyalliance.com";

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", back);

    return () => BackHandler.removeEventListener("hardwareBackPress", back);
  }, []);

  return (
    <>
      {loading ? (
        <Bar
          progress={loadingProgress}
          width={width}
          animated
          borderRadius={0}
          borderColor="#ffffff"
          color="#ec228d"
          style={styles.progress}
        />
      ) : (
        <></>
      )}

      <WebView
        key={key}
        ref={webViewRef}
        source={{ uri: defaultURL }}
        onLoadEnd={() => {
          setLoading(false);
        }}
        onLoadStart={() => {
          setLoading(true);
        }}
        onLoadProgress={({ nativeEvent }) => {
          setLoadingProgress(nativeEvent.progress);
        }}
        onNavigationStateChange={(webViewState) => {
          setUrlChanged(webViewState.url !== defaultURL);
        }}
        style={{
          height: height,
          width: width,
          position: "absolute",
          backgroundColor: "#f6f9f9",
          ...Platform.select({
            ios: {
              top: 42,
            },
            android: {
              top: 10,
            },
          }),
          left: 0,
        }}
        allowFileAccess
        allowsLinkPreview
        allowsInlineMediaPlayback
        allowsBackForwardNavigationGestures
        scrollEnabled
        automaticallyAdjustsScrollIndicatorInsets
        useWebView2
        nestedScrollEnabled
      />
      <KeyboardSpacer/>
      <View style={styles.bottomView}>
        <View style={styles.col6}>
          <Button
            style={styles.btn}
            textStyle={styles.btnTextStyle}
            onPress={home}
          >
            <View style={styles.btnContent}>
              <Image style={styles.btnIcon} source={homeIcon} />
              <Text>Home</Text>
            </View>
          </Button>
        </View>
        <View style={styles.col6}>
          <Button
            style={styles.btn}
            textStyle={styles.btnTextStyle}
            onPress={reload}
          >
            <View style={styles.btnContent}>
              <Image style={styles.btnIcon} source={reloadIcon} />
              <Text>Reload</Text>
            </View>
          </Button>
        </View>
      </View>
      <View style={styles.bottomViewH}></View>
    </>
  );
}

const styles = StyleSheet.create({
  progress: {
    position: "absolute",
    ...Platform.select({
      ios: {
        top: 32,
      },
      android: {
        top: 0,
      },
    }),
    left: 0,
    backgroundColor: "#f6f9f9",
  },
  nav: {
    position: "absolute",
    top: 50,
    right: 0,
  },
  bottomView: {
    flexDirection: "row",
    width: "100%",
    height: "3%",
  },
  bottomViewH: {
    flexDirection: "row",
    ...Platform.select({
      ios: {
        backgroundColor: "#f6f9f9",
        height: "3%",
        width: "100%",
      },
      android: {
        height: "2%",
        width: "100%",
      },
    }),
  },
  btn: {
    width: "100%",
    height: "250%",
    backgroundColor: "#f6f9f9",
    flexDirection: "column",
    paddingTop: 10,
    alignItems: "center",
  },
  btnContent: {
    flexDirection: "column",
    alignItems: "center",
  },
  btnIcon: {
    width: 20,
    height: 20,
  },
  btnTextStyle: {
    fontSize: 15,
  },
  col6: {
    flexDirection: "column",
    width: "50%",
    height: "100%",
    justifyContent: "center",
  },
});
