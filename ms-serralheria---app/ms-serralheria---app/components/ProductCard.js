import React from "react";

import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
} from "react-native";

export default function ProductCard({
  item,
  openModal,
}) {

  return (

    <View style={styles.summary}>

      <View style={styles.productInfo}>

        <Image
          source={item.imagem}
          style={styles.productImage}
        />

        <View>

          <Text style={styles.summaryText}>
            {item.item}
          </Text>

          <Text style={styles.price}>
            R$ {item.price}
          </Text>

        </View>

      </View>

<View style={{ width: 60 }}>

  <Button
    title="Info"
    color="#FF8C00"
    onPress={() => openModal(item)}
  />

</View>

</View>

  );
}

const styles = StyleSheet.create({

  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "white",
    elevation: 5,
  },

  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },

  summaryText: {
  fontSize: 14,
  fontWeight: "bold",
  flexShrink: 1,
},

  price: {
    marginTop: 5,
    fontSize: 16,
    color: "#666",
  },

});