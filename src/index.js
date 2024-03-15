import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

const DetectObject = () => {
    const [imageUri, setImageUri] = useState(null);
    const [labels, setlabels] = useState([]);

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.canceled) {
                setImageUri(result.assets[0].uri);
            }
            console.log(result);
        } catch (error) {
            console.error('Error picking image: ', error);
        }
    };

    const analyzeImage = async () => {
        try {
            if (!imageUri) {
                alert('Please select an image first!');
                return;
            }
            // Digita tu apiKey
            const apiKey = "";
            const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

            const base64ImageData = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const requestData = {
                requests: [
                    {
                        image: {
                            content: base64ImageData,
                        },
                        features: [{ type: 'LABEL_DETECTION', maxResults: 5 }],
                    },
                ],
            };

            const apiResponse = await axios.post(apiURL, requestData);
            setlabels(apiResponse.data.responses[0].labelAnnotations);
        } catch (error) {
            console.error('Error analyzing image: ', error);
            alert('Error analyzing image. Please try again later');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Detect Object Demo</Text>
            {imageUri && (
                <Image 
                    source={{uri:imageUri}}
                    style={{width:300,height:300}}
                />
            )}
            <TouchableOpacity 
                onPress={pickImage}
                style={styles.button}
            >
                <Text style={styles.text}>Choose an image...</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={analyzeImage}
                style={styles.button}
            >
                <Text style={styles.text}>Analyze image</Text>
            </TouchableOpacity>
            {
                labels.length > 0 && (
                    <View>
                        <Text style={styles.label}>
                            Labels: 
                        </Text>
                        {
                            labels.map((label) => (
                                <Text 
                                    key={label.mid}
                                    style={styles.outputtetxt}
                                >
                                    {label.description}
                                </Text>
                            ))
                        }
                    </View>
                )
            }
        </View>
    )
}


export default DetectObject


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 50,
        marginTop: 100,
    },
    button: {
        backgroundColor: '#BB33FF',
        padding: 10,
        marginBottom: 10,
        marginTop: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    }, 
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
    outputtetxt: {
        fontSize: 18,
        marginBottom: 10
    }
});