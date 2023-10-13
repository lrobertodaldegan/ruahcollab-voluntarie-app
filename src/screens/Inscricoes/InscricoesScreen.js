import {useState, useEffect} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
} from 'react-native';
import DemandaCard from '../../components/DemandaCard';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Label from '../../components/Label';
import Loader from '../../components/Loader';
import { get } from '../../service/Rest/RestService';

const InscricoesScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [inscricoes, setInscricoes] = useState([]);

  const init = () => {
    setLoading(true);
    setInscricoes([]);

    get('/subscription', () => navigation.navigate('error')).then(response => {
      if(response.status === 200)
        setInscricoes(response.data);

      setLoading(false);
    });
  }

  useEffect(() => {
    init();
  }, []);

  const renderHeader = () => {
    return (
      <>
        <Header navigation={navigation}/>

        <Label style={styles.title} value='Minhas inscrições:'/>
      </>
    )
  }

  const renderSubs = () => {
    if(loading){
      return <Loader />
    } else {
      if(inscricoes && inscricoes.length > 0){
        return (
          <FlatList style={styles.content}
              ListHeaderComponent={renderHeader()}
              keyExtractor={(item) => item.id}
              data={inscricoes}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={() => init()}/>
              }
              renderItem={({item}) => {
                if(item)
                  return <DemandaCard item={item}/>
                else
                  return <></>
              }}
          />
        )
      } else {
        return (
          <ScrollView contentContainerStyle={styles.wrap}
              refreshControl={<RefreshControl refreshing={loading} onRefresh={() => init()}/>}>
            
            {renderHeader()}
            
            <Label value='Suas inscrições aparecerão aqui'/>
          </ScrollView>
        )
      }
    }
  }

  return (
    <>
      <StatusBar backgroundColor='#fafafa' barStyle='dark-content'/>

      {renderSubs()}

      <Footer navigation={navigation} selected='inscricoes'/>
    </>
  );
}

const size = Dimensions.get('screen');

const styles= StyleSheet.create({
  wrap:{
    height:size.height,
    width:size.width,
    backgroundColor:'#fafafa',
    padding:20,
  },
  content:{
    marginBottom:120
  },
  title:{
    fontSize:18,
    fontFamily:"Montserrat-Bold",
    marginTop:30,
    marginBottom:20,
  },
});

export default InscricoesScreen;