import React from "react";
import { render } from "react-dom";

import { EuiText, EuiSpacer } from "@elastic/eui";
import { EuiComponent } from "./component";

import "./styles.scss";

const App = () => (
  <div style={{ maxWidth: 600, padding: 32 }}>
    <EuiText>
      <h3>EUI sandbox</h3>
      <p>
        This sandbox allows you to play around and work with latest version of
        EUI. It can utilize and import Sass files and work with the EUI
        variables.
      </p>
      <p>
        The component below exists only in the sandbox. Edit its contents in the
        `src/components` directory to begin hacking.
      </p>
    </EuiText>
    <EuiSpacer />
    <EuiComponent>I am a new Eui Component using Sass</EuiComponent>
  </div>
);

render(<App />, document.getElementById("app"));
