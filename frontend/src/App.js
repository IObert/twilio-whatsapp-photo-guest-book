import React, { Component } from "react";
import { SWRConfig } from "swr";
import ButtonAppBar from "./Header";
import Gallery from "./Gallery";

class App extends Component {
  render() {
    return (
      <SWRConfig
        value={{
          fallback: {
            "/media": [...Array(30)].map(() => null),
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
