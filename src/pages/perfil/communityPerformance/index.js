import React, { useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from './../../../config';
import { UserContext } from './../../../UserContext';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export function CommunityPerformance() {
  const { userId } = useContext(UserContext);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [monthlySalesData, setMonthlySalesData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const screenWidth = Dimensions.get("window").width;

  const fetchSalesData = async () => {
    if (userId) {
      try {
        const response = await fetch(`${API_BASE_URL}/vendas/${userId}`);
        if (response.ok) {
          const data = await response.json();
          processSalesData(data);
          processMonthlySalesData(data);
        } else {
          console.error("Erro ao buscar dados de vendas:", response.status);
        }
      } catch (error) {
        console.error("Erro ao buscar dados de vendas:", error);
      }
    }
  };

  const processSalesData = (data) => {
    const salesByCategory = {};

    data.forEach(item => {
      const { category, quantity, totalSaleValue } = item;

      if (!salesByCategory[category]) {
        salesByCategory[category] = { totalQuantity: 0, totalValue: 0 };
      }

      salesByCategory[category].totalQuantity += quantity;
      salesByCategory[category].totalValue += totalSaleValue;
    });

    const labels = Object.keys(salesByCategory);
    const values = labels.map(label => salesByCategory[label].totalValue);

    setSalesData({
      labels,
      datasets: [{ data: values }]
    });
  };

  const processMonthlySalesData = (data) => {
    const monthlyData = {};
    const monthlyQuantity = {};
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    data.forEach(item => {
      const purchaseDate = new Date(item.purchaseDate);
      const month = monthNames[purchaseDate.getMonth()]; // Nome do mês em português

      if (!monthlyData[month]) {
        monthlyData[month] = 0;
        monthlyQuantity[month] = 0;
      }

      monthlyData[month] += item.totalSaleValue;
      monthlyQuantity[month] += item.quantity;
    });

    const labels = monthNames; // Ordena os meses em ordem cronológica
    const salesValues = labels.map(label => monthlyData[label] || 0);
    const quantityValues = labels.map(label => monthlyQuantity[label] || 0);

    setMonthlySalesData({
      salesData: {
        labels,
        datasets: [{ data: salesValues }]
      },
      quantityData: {
        labels,
        datasets: [{ data: quantityValues }]
      }
    });
  };

  const renderCharts = () => {
    if (!salesData || !monthlySalesData) {
      return <Text>Carregando dados de vendas...</Text>;
    }
  
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.dropdownText}>Lucro por Categoria</Text>
        <BarChart
          data={salesData}
          width={screenWidth * 0.90}
          height={220}
          yAxisLabel="R$"
          fromZero={true}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#f3f3f3',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `grey`, 
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
            strokeWidth: 2,
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
  
        <Text style={styles.dropdownText}>Lucro Mensal</Text>
        <LineChart
          data={monthlySalesData.salesData}
          width={screenWidth * 0.90}
          height={220}
          yAxisLabel="R$"
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#f3f3f3',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `grey`, 
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
            strokeWidth: 1,
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />

        <Text style={styles.dropdownText}>Quantidade de Vendas Mensais</Text>
        <LineChart
          data={monthlySalesData.quantityData}
          width={screenWidth * 0.90}
          height={220}
          yAxisLabel="Qtd: "
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#f3f3f3',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `grey`, 
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
            strokeWidth: 1,
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          
        />
      </View>
    );
  };
  
  

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchSalesData();
      setLoading(false);
    }, [userId])
  );

  return (
    <View style={styles.tela}>
      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.returnButtonContainer}>
            <Image source={require('./../../../assets/return.png')} style={styles.returnButton} />
          </TouchableOpacity>
          <Text style={styles.title}>Performance da Comunidade</Text>
          {renderCharts()}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  container: {
    flexGrow: 1,
    marginTop: 25,
    paddingHorizontal: "5%",
    paddingBottom: 20,
  },
  returnButtonContainer: {
    marginBottom: 20,
  },
  returnButton: {
    height: 25,
    width: 30,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold'
  },
  dropdownText: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: "black",
  },
  chartContainer: {
    alignItems: 'center',
  }
});
