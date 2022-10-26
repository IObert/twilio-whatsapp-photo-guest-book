import React, {Component} from 'react'
// import './App.css';
import ButtonAppBar from './Header'
import TitlebarGridList from './Cards'
// import MyButton from './components/Footer'

class App extends Component {
  render() {
    return (
      <div>
        <ButtonAppBar />
        <TitlebarGridList />
        {/* <MyButton/> */}
      </div>
    );
  }
}

export default App;