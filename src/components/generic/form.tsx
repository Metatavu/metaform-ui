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
import { FileFieldValue, FileFieldValueItem } from "metaform-react/dist/types";

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
          onFileDelete={ this.deleteFile }
          onFileShow={ this.showFile }
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
    
    if (files instanceof FileList) {
      for (let i = 0; i < files.length; i++) {
        let item = files.item(i);
        if (item) {
          this.doUpload(fieldName, item, path);
        }
      }
    } else if (files instanceof File) {
      this.doUpload(fieldName, files, path);
    }
  }

  private doUpload(fieldName: string, file: File, path: string) {
    const data = new FormData();
    data.append("file", file);
    fetch(path, {
      method: "POST",
      body: data
    })
    .then(res => res.json())
    .then((data) => {
      let currentFiles = this.props.getFieldValue(fieldName);
      if (!currentFiles) {
        currentFiles = { files: [] };
      }
      const value = {
        id: data.fileRef,
        secure: false,
        name: data.fileName,
        url: this.createDefaultFileUrl(data.fileRef)
      } as FileFieldValueItem;
      (currentFiles as FileFieldValue).files.push(value);
      this.props.setFieldValue(fieldName, {...currentFiles as FileFieldValue});
    })
  }

  private createDefaultFileUrl = (id: string): string => {
    let apiUrl = process.env.REACT_APP_API_BASE_PATH || "";
    const apiVersionSlashIndex = apiUrl.lastIndexOf("/v1");
    if (apiVersionSlashIndex < 0) {
      return "";
    }
    return apiUrl.slice(0, apiVersionSlashIndex) + "/fileUpload?fileRef=" + id
  }

  private deleteFile = (fieldName: string, value: FileFieldValueItem) => {
    let currentFiles = this.props.getFieldValue(fieldName);
    if (!currentFiles) {
      currentFiles = { files: [] };
    }
    const files = (currentFiles as FileFieldValue).files.filter(f => f.id !== value.id);
    this.props.setFieldValue(fieldName, { files });
    
    //Only unsecured values can be deleted from server
    if (!value.secure) {
      fetch(this.createDefaultFileUrl(value.id), { method: "DELETE" })
        .then((res) => {
          if (res.ok) {
            console.log("Deleted from server");
          }
        })
    }
  }

  private showFile = (fieldName: string, value: FileFieldValueItem) => {
    if (!value.secure) {
      window.open(value.url, "blank");
    }
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
