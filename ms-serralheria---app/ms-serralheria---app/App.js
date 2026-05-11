import React, { Component } from "react";

import {
  Text,
  Button,
  View,
  StyleSheet,
  ScrollView,
  Modal,
  Linking,
  Image,
} from "react-native";

import ProductCard from "./components/ProductCard";

import portoesBasculantes from "./data/portoesBasculantes";
import portoesCorrer from "./data/portoesCorrer";
import grades from "./data/grades";
import coberturas from "./data/coberturas";
import guardaCorpo from "./data/guardaCorpo";

const allProducts = [
  ...portoesBasculantes,
  ...portoesCorrer,
  ...grades,
  ...coberturas,
  ...guardaCorpo,
];

class App extends Component {

  state = {
    selectedItem: null,
    modalVisible: false,
    cartModalVisible: false,
    confirmModalVisible: false,
    cart: [],
    selectedCategory: null,
  };

  categories = [
    "Portões de Correr",
    "Portões Basculantes",
    "Guarda Corpo",
    "Grades de Proteção",
    "Coberturas",
  ];

  openModal = (item) => {

    this.setState({
      selectedItem: item,
      modalVisible: true,
    });

  };

  closeModal = () => {

    this.setState({
      modalVisible: false,
    });

  };

  addToCart = (item) => {

    const existingItem = this.state.cart.find(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItem) {

      const updatedCart = this.state.cart.map((cartItem) => {

        if (cartItem.id === item.id) {

          return {
            ...cartItem,
            quantity: cartItem.quantity + 1,
          };

        }

        return cartItem;

      });

      this.setState({
        cart: updatedCart,
      });

    } else {

      this.setState((prevState) => ({
        cart: [
          ...prevState.cart,
          {
            ...item,
            quantity: 1,
          },
        ],
      }));

    }

    alert(`${item.item} adicionado ao carrinho`);

  };

  removeFromCart = (itemId) => {

    const updatedCart = this.state.cart
      .map((item) => {

        if (item.id === itemId) {

          return {
            ...item,
            quantity: item.quantity - 1,
          };

        }

        return item;

      })
      .filter((item) => item.quantity > 0);

    this.setState({
      cart: updatedCart,
    });

  };

  formatCurrency = (value) => {

    return Number(value).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );

  };

  getCartTotal = () => {

    return this.state.cart.reduce((total, item) => {

      return total + (
        Number(item.price) * item.quantity
      );

    }, 0);

  };

  sendWhatsApp = () => {

    if (this.state.cart.length === 0) {

      alert("Carrinho vazio");
      return;

    }

    let message =
      "Olá, encontrei esses seus produtos e estou interessado(a) em fazer a compra deles.%0A";

    this.state.cart.forEach((item) => {

      message +=
        `%0A• ${item.item} (${item.quantity}x)` +
        ` - ${
          this.formatCurrency(
            Number(item.price) * item.quantity
          )
        }`;

    });

    message +=
      `%0A%0ATotal do pedido: ${
        this.formatCurrency(this.getCartTotal())
      }`;

    message +=
      "%0A%0APoderiam me passar mais informações sobre os mesmos?";

    const phone = "5519989874111";

    const url =
      `https://wa.me/${phone}?text=${message}`;

    Linking.openURL(url);

  };

  render() {

    return (

      <View style={styles.screen}>

        <Image
          source={require("./assets/logo.png")}
          style={styles.logo}
        />

        <Text style={styles.subtitle}>
          Segurança, praticidade e tecnologia para o seu acesso!🔐.
          Conheça nossos produtos
        </Text>

        {this.state.selectedCategory === null ? (

          <View>

            {this.categories.map((category, index) => (

              <View
                key={index}
                style={{ marginBottom: 15 }}
              >

                <Button
                  title={category}
                  color="#FF8C00"
                  onPress={() =>
                    this.setState({
                      selectedCategory: category,
                    })
                  }
                />

              </View>

            ))}

          </View>

        ) : (

          <>

            <View style={{ marginBottom: 15 }}>

              <Button
                title="Voltar para Categorias"
                color="#555"
                onPress={() =>
                  this.setState({
                    selectedCategory: null,
                  })
                }
              />

            </View>

            <ScrollView>

              {allProducts
                .filter(
                  (item) =>
                    item.category ===
                    this.state.selectedCategory
                )
                .map((item) => (

                  <ProductCard
                    key={item.id}
                    item={item}
                    openModal={this.openModal}
                  />

                ))}

            </ScrollView>

          </>

        )}

        <View style={{ marginBottom: 10 }}>

          <Button
            title="Ver Carrinho"
            color="#FF8C00"
            onPress={() =>
              this.setState({
                cartModalVisible: true,
              })
            }
          />

        </View>

        <View style={styles.footer}>

          <Button
            title={`Finalizar Pedido (${this.state.cart.length})`}
            color="green"
            onPress={() =>
              this.setState({
                confirmModalVisible: true,
              })
            }
          />

        </View>

        <Modal
          visible={this.state.modalVisible}
          animationType="slide"
          transparent={true}
        >

          <View style={styles.modalBackground}>

            <View style={styles.modalContainer}>

              {this.state.selectedItem && (

                <>

                  <Text style={styles.modalTitle}>
                    {this.state.selectedItem.item}
                  </Text>

                  <Image
                    source={this.state.selectedItem.imagem}
                    style={styles.modalImage}
                  />

                  <Text style={styles.info}>
                    💰 Preço: {
                      this.formatCurrency(
                        this.state.selectedItem.price
                      )
                    }
                  </Text>

                  <Text style={styles.info}>
                    🛠 Material: {this.state.selectedItem.material}
                  </Text>

                  <Text style={styles.info}>
                    📏 Dimensões: {this.state.selectedItem.dimensoes}
                  </Text>

                  <Text style={styles.info}>
                    📋 {this.state.selectedItem.descricao}
                  </Text>

                  <View style={styles.buttonSpacing}>

                    <Button
                      title="Adicionar ao Carrinho"
                      color="#FF8C00"
                      onPress={() =>
                        this.addToCart(this.state.selectedItem)
                      }
                    />

                  </View>

                  <Button
                    title="Fechar"
                    color="#000"
                    onPress={this.closeModal}
                  />

                </>

              )}

            </View>

          </View>

        </Modal>

        <Modal
          visible={this.state.cartModalVisible}
          animationType="slide"
        >

          <View style={styles.screen}>

            <Text style={styles.modalTitle}>
              Carrinho
            </Text>

            <ScrollView>

              {this.state.cart.map((item) => (

                <View
                  key={item.id}
                  style={styles.summary}
                >

                  <View>

                    <Text style={styles.summaryText}>
                      {item.item}
                    </Text>

                    <Text style={styles.price}>
                      Quantidade: {item.quantity}
                    </Text>

                    <Text style={styles.price}>
                      {
                        this.formatCurrency(
                          Number(item.price) * item.quantity
                        )
                      }
                    </Text>

                  </View>

                  <View>

                    <View style={{ marginBottom: 10 }}>

                      <Button
                        title="+"
                        color="green"
                        onPress={() => this.addToCart(item)}
                      />

                    </View>

                    <Button
                      title="-"
                      color="red"
                      onPress={() =>
                        this.removeFromCart(item.id)
                      }
                    />

                  </View>

                </View>

              ))}

            </ScrollView>

            <Text style={styles.totalText}>
              Total: {
                this.formatCurrency(
                  this.getCartTotal()
                )
              }
            </Text>

            <Button
              title="Fechar Carrinho"
              color="#000"
              onPress={() =>
                this.setState({
                  cartModalVisible: false,
                })
              }
            />

          </View>

        </Modal>

        <Modal
          visible={this.state.confirmModalVisible}
          animationType="slide"
          transparent={true}
        >

          <View style={styles.modalBackground}>

            <View style={styles.modalContainer}>

              <Text style={styles.modalTitle}>
                Confirmar Pedido
              </Text>

              <ScrollView>

                {this.state.cart.map((item) => (

                  <Text
                    key={item.id}
                    style={styles.info}
                  >
                    • {item.item} ({item.quantity}x)
                    {" - "}
                    {
                      this.formatCurrency(
                        Number(item.price) * item.quantity
                      )
                    }
                  </Text>

                ))}

              </ScrollView>

              <Text style={styles.totalText}>
                Total: {
                  this.formatCurrency(
                    this.getCartTotal()
                  )
                }
              </Text>

              <View style={styles.buttonSpacing}>

                <Button
                  title="Confirmar Pedido"
                  color="green"
                  onPress={() => {

                    this.setState({
                      confirmModalVisible: false,
                    });

                    this.sendWhatsApp();

                  }}
                />

              </View>

              <Button
                title="Cancelar"
                color="red"
                onPress={() =>
                  this.setState({
                    confirmModalVisible: false,
                  })
                }
              />

            </View>

          </View>

        </Modal>

      </View>

    );
  }
}

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#EFEFEF",
  },

  logo: {
    width: 250,
    height: 300,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },

  footer: {
    marginVertical: 15,
  },

  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "white",
    elevation: 5,
  },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#FF8C00",
    textAlign: "center",
  },

  modalImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 15,
  },

  info: {
    fontSize: 18,
    marginBottom: 12,
  },

  buttonSpacing: {
    marginBottom: 10,
  },

  summaryText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  price: {
    marginTop: 5,
    fontSize: 16,
    color: "#666",
  },

  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },

  totalText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "green",
  },

});

export default App;