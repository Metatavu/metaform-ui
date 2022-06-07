import { Box, FormControl, FormLabel, TextField } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/styles";
import { MetaformField } from "metaform-react";
import React from "react";
import strings from "../../../localization/strings";
import styles from "../../../styles/generics/editor-screen-tabs/component-tab";

/**
 * Interface representing component properties
 */
interface Props extends WithStyles<typeof styles> {
    selectedField?: MetaformField;
    onFieldUpdate?: (metaformField: MetaformField) => void;
}

/**
 * Interface representing component state
 */
interface State {
}

/**
 * Component for right side drawer features tab
 */
class FeaturesTab extends React.Component<Props, State> {

  /**
   * Constructor
   * 
   * @param props component props
   */
  constructor(props: Props) {
    super(props);

    this.state = {
    };
  }

  /**
   * Component render method
   */
  public render() {
    const { classes, selectedField } = this.props;
    return (
      <Box className={ classes.componentContainer }>
        <FormControl>
          <FormLabel>
            { strings.featureTabContainer.fieldInfo }
          </FormLabel>
          <TextField
            label={ strings.featureTabContainer.fieldTitle }
            value={ selectedField?.title }
            variant="outlined"
            onChange={ this.handleFieldTitleChange }
          />
        </FormControl>
      </Box>
    );
  }

  /**
   * Event handler for field title value change
   * 
   * @param event new field title value
  */ 
  private handleFieldTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { selectedField, onFieldUpdate } = this.props;


    const updatedField = { 
      ...selectedField 
    } as MetaformField;

    updatedField.title = event.target.value;

    onFieldUpdate && onFieldUpdate(updatedField);
  }

}

export default withStyles(styles)(FeaturesTab);