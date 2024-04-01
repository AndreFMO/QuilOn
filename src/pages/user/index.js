import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

export function User() {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>Usuário</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFF",
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 22,
    },
  });
  