import {useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
} from 'react-native';
import DemandaCard from '../../components/DemandaCard';
import InstitutionCard from '../../components/InstitutionCard';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Label from '../../components/Label';
import {get} from '../../service/Rest/RestService';
import Loader from '../../components/Loader';

const PesquisaScreen = ({navigation}) => {
  const [demands, setDemands] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const doSearch = (s, f) => {
    setLoading(true);
    setDemands([]);
    setInstitutions([]);

    let url = '/demand';

    if(s && s?.length > 2)
      url = url + `?title=${s}`;

    get(url, () => navigation.navigate('login')).then(response => {
      if(response.status === 200){
        setDemands(response.data.demands);
        setInstitutions(response.data.institutions);

        let rs = [];

        if(f === null || f && f === 'demanda'){
          response.data.demands.forEach(d => {
            d.searchType='d';

            rs.push(d);
          });
        }

        if(f === null || f && f === 'instituicao'){
          response.data.institutions.forEach( i => {
            i.searchType='i';
            
            rs.push(i);
          });
        }

        setResults(rs);
      }

      setLoading(false);
    }).catch(err => {console.log(err); navigation.navigate('error');});
  }

  const renderResults = () => {
    if(loading){
      return <Loader />
    } else {
      if(results && results?.length > 0){
        return (
          <FlatList style={styles.content}
              data={results}    
              keyExtractor={(item) => item._id ? item._id : item.id}
              ListHeaderComponent={
                <Header navigation={navigation} searchActive={true}
                    searchAction={(s, f) => doSearch(s, f)}/>
              }
              refreshControl={
                <RefreshControl refreshing={loading} 
                    onRefresh={() => doSearch(null, null)}/>
              }
              renderItem={({item}) => {
                if(item.searchType === 'd'){
                  let demand = {
                    ...item, 
                    institution:institutions.filter(i => i._id === item.institutionId)[0]
                  }

                  return <DemandaCard item={demand}/>
                } else {
                  return <InstitutionCard item={item}/>
                }
              }}
          />
        )
      } else {
        return (
          <ScrollView contentContainerStyle={styles.wrap}
              refreshControl={<RefreshControl refreshing={loading} 
              onRefresh={() => doSearch(null, null)}/>}>

            <Header navigation={navigation} searchActive={true}
                searchAction={(s, f) => doSearch(s, f)}/>

            <Label value='Nenhum resultado encontrado'/>
          </ScrollView>
        )
      }
    }
  }

  return (
    <>
      <StatusBar backgroundColor='#fafafa' barStyle='dark-content'/>

      {renderResults()}

      <Footer navigation={navigation} selected='pesquisa'/>
    </>
  );
}

const size = Dimensions.get('screen');

const styles= StyleSheet.create({
  wrap:{
    height:size.height + 70,
    width:size.width,
    backgroundColor:'#fafafa',
    padding:20,
    marginBottom:50
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

export default PesquisaScreen;