import {storiesOf} from "@storybook/react-native";
import * as React from "react";

import {App} from "../App";

const Public = () => <App />;

storiesOf("App", module).add("Public", () => <Public />);
