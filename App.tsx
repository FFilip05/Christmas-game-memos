import { View, StyleSheet} from 'react-native';
import Game from "./src/components/Game"


export default function App() {
 
  return (
    <View style={styles.wrapper}>
    <Game/>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1, flexDirection: 'row', alignItems: 'center' 
  },
  
});
