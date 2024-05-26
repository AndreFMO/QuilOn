import React from 'react';
import { View, StyleSheet } from 'react-native';

const DotIndicator = ({ totalSteps, currentStep }) => {
  const dots = [];

  for (let i = 0; i < totalSteps; i++) {
    dots.push(
      <View
        key={i}
        style={[
          styles.dot,
          i === currentStep ? styles.activeDot : null,
        ]}
      />
    );
  }

  return <View style={styles.container}>{dots}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DDDDDD',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#BF8B6E',
  },
});

export default DotIndicator;
