import * as React from "react";

import styles from "../../styles/form";

import { WithStyles, withStyles, Icon } from "@material-ui/core";
import { Metaform } from "../../generated/client";
import { MetaformComponent, FieldValue, IconName } from "metaform-react";
import DatePicker from "react-datepicker";
import AddIcon from '@material-ui/icons/Add';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import strings from "../../localization/strings";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  contexts: string[];
  metaform: Metaform;
  getFieldValue: (fieldName: string) => FieldValue;
  setFieldValue: (fieldName: string, fieldValue: FieldValue) => void;
  onSubmit: (source: Metaform) => void;
}

/**
 * Component state
 */
interface State {
}

/**
 * Component for exhibitions screen
 */
export class Form extends React.Component<Props, State> {

  /**
   * Constructor
   *
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
    this.state = {      
    };
  }

  /**
   * Component render method
   */
  public render = () => {
    const { classes, metaform } = this.props;

    return (
      <div className={ classes.formContainer }>
        <MetaformComponent
          strings={ strings.form }
          form={ metaform } 
          contexts={ this.props.contexts }
          formReadOnly={ false }
          getFieldValue={ this.props.getFieldValue }
          setFieldValue={ this.props.setFieldValue }
          datePicker={ this.renderDatePicker }
          datetimePicker={ this.renderDatetimePicker }
          uploadFile={ this.uploadFile }
          setAutocompleteOptions={ this.setAutocompleteOptions }
          renderIcon={ this.renderIcon }        
          onSubmit={ this.props.onSubmit }
        />
      </div>
    );
  }

  /**
   * Method for setting date
   *
   * @param onChange on change callback for setting date
   */
  private renderDatePicker = (fieldName: string, onChange: (date: Date) => void) => {
    const value = this.props.getFieldValue(fieldName);
    return (
      <DatePicker
        selected={ value ? new Date(value as string) : null }
        onChange={ onChange }
        dateFormat="dd.MM.yyyy"
        locale="fi"
      />
    );
  }

  /**
   * Method for setting datetime
   *
   * @param onChange on change callback for setting datetime
   */
  private renderDatetimePicker = (fieldName: string, onChange: (date: Date) => void) => {
    const value = this.props.getFieldValue(fieldName);
    return (
      <DatePicker
        selected={ value ? new Date(value as string) : null }
        onChange={ onChange }
        dateFormat="dd.MM.yyyy"
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={ 15 }
        locale="fi"
      />
    );
  }

  /**
   * Method for uploading a file
   *
   * @param file file
   * @param path path
   */
  private uploadFile = (fieldName: string, files: FileList | File, path: string) => {

  }

  /**
   * Method for setting autocomplete options
   *
   * @param path path
   */
  private setAutocompleteOptions = async (path: string, input?: string): Promise<string[]> => {
    return [];
  }
  
  /**
   * Method for rendering form icons
   *
   * @param icon icon name
   * @param key key
   */
  private renderIcon = (icon: IconName, key: string): React.ReactNode => {
    switch (icon) {
      case "add":
        return <AddIcon/>
      case "check-square-o":
        return <CheckBoxIcon/>
      case "square-o":
        return <CheckBoxOutlineBlankIcon/>
    }

    return <Icon className={ icon } />;
  }

}

export default withStyles(styles)(Form);
