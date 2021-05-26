import * as React from "react";
import { Button, Image, View, Platform } from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class PickImage extends React.Component {
  state = {
    image: null,
  };

  render() {
    let { image } = this.state;
    return (
      <View>
        <Button
          title="Image Picker"
          onPress={this.pickImage}
        />
      </View>
    );
  }

  getPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status !== "granted") {
        alert("Permissions not granted. Cannot run the app!!");
      }
    }
  };

  componentDidMount() {
    this.getPermissions();
  }

  uploadImage = async (uri) => {
    const data = new FormData();

    let file_name = uri.split("/")[uri.split("/").length - 1];
    let type = `image/${uri.split(".")[uri.split(".").length - 1]}`;

    const fileToUpload = {
      uri: uri,
      name: file_name,
      type: type,
    };

    data.append("digit", fileToUpload);

    fetch("http://9301cf5af153.ngrok.io/predict-digit", {
      method: "POST",
      body: data,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((response) => {response.json();})
      .then((result) => {
        console.log("Success: ", result);
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  };

  pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        this.setState({image: result.data});

        this.uploadImage(result.uri);
      }
    } catch (err) {
      console.log(err);
    }
  };
}
