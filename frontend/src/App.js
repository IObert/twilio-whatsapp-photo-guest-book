import React, { Component } from "react";
import { SWRConfig } from "swr";
import ButtonAppBar from "./Header";
import Gallery from "./Gallery";
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
        <Gallery />
      </SWRConfig>
    );
  }
}

export default App;
