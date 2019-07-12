import * as React from "react";
import {storiesOf} from "@storybook/react-native";
import {App} from "../App";

const Public = () => <App />;

storiesOf("App", module).add("Public", () => <Public />);
