import { Box, TextField } from "@material-ui/core";
import { withStyles, WithStyles } from "@material-ui/styles";
import React from "react";
import styles from "../../../styles/generics/editor-screen-tabs/form-tab";
import { Metaform } from "../../../generated/client";
import strings from "../../../localization/strings";

/**
 * Interface representing component properties
 */
interface Props extends WithStyles<typeof styles> {
  onSetMetaform: (metaform?: Metaform) => void;
  metaform?: Metaform;
}

/**
 * Interface representing component state
 */
interface State {
}

/**
 * Form tab
 */
class FormTab extends React.Component<Props, State> {

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
    const { classes, metaform } = this.props;

    if (!metaform) {
      return null;
    }

    return (
      <Box className={ classes.formEditingContainer }>
        <TextField
          variant="outlined"
          value={ metaform.title }
          onChange={ this.onFormTitleChange }
          label={strings.formEditScreen.title  }
        />
      </Box>
    );
  }

  /**
   * Form title change event handler
   * 
   * @param event react input change event
   */
  private onFormTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { metaform, onSetMetaform } = this.props;

    const updatedMetaform = {
      ...metaform,
      title: event.target.value as string,
    }

    onSetMetaform(updatedMetaform);
  }
}

export default withStyles(styles)(FormTab);