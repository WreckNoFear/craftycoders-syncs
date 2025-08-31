import BackButton from "@/src/components/back-button";
import { styles } from "@/src/styles/css/sustainability";
import { Theme } from "@/src/styles/theme";
import { Leaf } from "lucide-react-native";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const SustainabilityReport = () => {
  const DATA = [
    { value: 400, label: "Mon" },
    { value: 500, label: "Tue", frontColor: Theme.COLORS.PRIMARY },
    { value: 239, label: "Wed", frontColor: Theme.COLORS.PRIMARY },
    { value: 230, label: "Thu" },
    { value: 233, label: "Fri", frontColor: Theme.COLORS.PRIMARY },
    { value: 123, label: "Sat" },
    { value: 129, label: "Sun" },
  ];

  return (
    <View style={styles.container}>
      <BackButton />
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Leaf />
          <Text style={styles.title}>Sustainability Report</Text>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartLabel}>CO₂ Emissions Past Week</Text>
          <BarChart
            barWidth={22}
            noOfSections={3}
            barBorderRadius={4}
            frontColor={Theme.COLORS.GRAY}
            verticalLinesColor={Theme.COLORS.PRIMARY}
            data={DATA}
            yAxisThickness={0}
            xAxisThickness={0}
          />
        </View>

        <View style={styles.savedContainer}>
          <Text style={styles.savedText}>You Have Saved</Text>
          <Text style={styles.savedBigText}>3,600</Text>
          <Text style={styles.savedText}>
            by choosing to use public transport
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SustainabilityReport;
