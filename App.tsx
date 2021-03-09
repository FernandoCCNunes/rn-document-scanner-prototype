/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { Component } from "react";
import {
    StatusBar,
    Image
} from "react-native";

import { Button, Icon, Text, View } from "native-base";


import RNDocumentScanner from "react-native-document-scanner";

import ImgToBase64 from "react-native-image-base64";

export interface Photo {
    uri: string,
    base64: string
}

interface IconAction {
    title: string,
    onPress: () => void
    iconName: string
}

interface DocumentScannerPrototypeProps {

}

interface DocumentScannerPrototypeState {
    isCapturing: boolean
    isCropping: boolean
    isProcessingImageCrop: boolean
    photo: Photo | null
}

class DocumentScannerPrototype extends Component<DocumentScannerPrototypeProps, DocumentScannerPrototypeState> {
    private _scanner: any = null;

    constructor(props: DocumentScannerPrototypeProps) {
        super(props);
        this.state = {
            isCapturing: false,
            isCropping: false,
            isProcessingImageCrop: false,
            photo: null
        };
    }

    private _onStartCapture = (): void => {
        this.setState({ isCapturing: true });
    };

    private _onEndCapture = (): void => {
        this._setToCroppingMode()
    };

    private _onCropButtonPress = (): void => {
        this.setState({ isProcessingImageCrop: true, isCropping: false });
        this._scanner?.cropImage().then(({ image }) => {
            this._setPhotoUri(image);
            console.log("image:", image);
            try {
                ImgToBase64.getBase64String(image)
                    .then((base64String) => {
                        this._setPhotoBase64(base64String);
                        console.log("base64:", base64String);
                    })
                    .catch((err) => console.log("error:", error));
            } catch (e) {
                console.log("error:", e);
            }
        });
    };

    private _onRemoveButtonPress = (): void => {
        this._setToScannerMode()
    };

    private _onContinueButtonPress = (): void => {

    }

    private _setPhotoUri = (uri: string): void => {
        this.setState({
            photo: { ...this.state.photo, uri } as Photo
        });
    };

    private _setPhotoBase64 = (base64: string): void => {
        this.setState({
            photo: { ...this.state.photo, base64 } as Photo,
            isProcessingImageCrop: false
        });
    };

    private _setToScannerMode = (): void => {
        this.setState({
            isCapturing: false,
            isCropping: false,
            isProcessingImageCrop: false,
            photo: null
        })
        this._scanner?.restart()
    }

    private _setToCroppingMode = (): void => {
        this.setState({
            isCapturing: false,
            isCropping: true,
            isProcessingImageCrop: false,
            photo: null
        })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="dark-content" />
                {this.renderScanner()}
                {this._renderCropActionBar()}
                {this._renderCroppedImage()}
            </View>
        );
    }

    renderScanner = () => {
        if (this.state.photo === null) {
            return (
                <>
                    <RNDocumentScanner
                        ref={ref => (this._scanner = ref)}
                        onStartCapture={this._onStartCapture}
                        onEndCapture={this._onEndCapture}
                    />
                    <Text
                        style={{
                            backgroundColor: "rgba(0,0,0,.5)",
                            width: "100%",
                            paddingVertical: 16,
                            textAlign: "center",
                            position: "absolute",
                            top: 48,
                            zIndex: 10,
                            fontSize: 18
                        }}>
                        Scan your document
                    </Text>
                </>
            );
        }
    };

    private _renderCroppedImage = () => {
        if (this.state.photo !== null) {
            return (
                <>
                    <Image resizeMode={"contain"} source={{ uri: this.state.photo.uri }} style={{ flex: 1 }} />
                    {this._renderBottomActionBase(
                        { title: "Remove", iconName: "close", onPress: this._onRemoveButtonPress },
                        { title: "Continue", iconName: "check", onPress: this._onContinueButtonPress }
                    )}
                </>

            );
        }
    };

    private _renderCropActionBar = () => {
        if (this.state.isCropping) {
            return this._renderBottomActionBase(
                { title: "Remove", iconName: "close", onPress: this._onRemoveButtonPress },
                { title: "Crop", iconName: "crop", onPress: this._onCropButtonPress }
            );
        }
    };

    private _renderBottomActionBase = (iconActionLeft: IconAction, iconActionRight: IconAction) => {
        return (
            <View
                style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    right: 0,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    backgroundColor: "rgba(0,0,0,.3)"
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between"

                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    >
                        <Button onPress={iconActionLeft.onPress} icon rounded
                                style={{ width: 56, height: 56, borderRadius: 28, marginEnd: 16 }}>
                            <Icon type={"MaterialCommunityIcons"} name={iconActionLeft.iconName} />
                        </Button>
                        <Text>
                            {iconActionLeft.title}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text>
                            {iconActionRight.title}
                        </Text>
                        <Button onPress={iconActionRight.onPress} icon rounded
                                style={{ width: 56, height: 56, borderRadius: 28, marginStart: 16 }}>
                            <Icon type={"MaterialCommunityIcons"} name={iconActionRight.iconName} />
                        </Button>
                    </View>
                </View>
            </View>
        );
    };
}


export default DocumentScannerPrototype;
