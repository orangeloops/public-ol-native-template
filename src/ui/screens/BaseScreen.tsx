import {NavigationParams, NavigationScreenProps} from "react-navigation";
import {BaseComponent} from "../components/BaseComponent";

export type BaseScreenProps<P = NavigationParams, O = {}> = NavigationScreenProps<P, O>;

export type BaseScreenState = {};

export abstract class BaseScreen<P extends BaseScreenProps = BaseScreenProps, S extends BaseScreenState = BaseScreenState> extends BaseComponent<P, S> {}
