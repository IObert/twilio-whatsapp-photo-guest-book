import React, { Component } from "react";
import { SWRConfig } from "swr";
import ButtonAppBar from "./Header";
import TitlebarGridList from "./Cards";
// import MyButton from './components/Footer'

class App extends Component {
  render() {
    return (
      <SWRConfig
        value={{
          fallback: {
            "/images": [...Array(30)].map(() => null),
          },
        }}
      >
        <ButtonAppBar />
        <TitlebarGridList />
      </SWRConfig>
    );
  }
}

export default App;
