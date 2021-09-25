import * as React from "react";

import styles from "../../styles/form";

import { WithStyles, withStyles, Icon, LinearProgress, Slider } from "@material-ui/core";
import { Metaform, MetaformField, MetaformFieldAutocompleteOptions, MetaformFieldAutocompleteService } from "../../generated/client";
import { MetaformComponent, FieldValue, IconName } from "metaform-react";
import DatePicker from "react-datepicker";
import AddIcon from '@material-ui/icons/Add';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import strings from "../../localization/strings";
import { FileFieldValue, FileFieldValueItem, ValidationErrors } from "metaform-react/dist/types";
import { AccessToken } from "../../types";
import Api from "../../api/api";
import Utils from "../../utils";
import "react-datepicker/dist/react-datepicker.css";
import FormAutocomplete from "./form-autocomplete";

/**
 * Component props
 */
interface Props extends WithStyles<typeof styles> {
  contexts: string[];
  metaform: Metaform;
  accessToken?: AccessToken;
  ownerKey?: string;
  getFieldValue: (fieldName: string) => FieldValue;
  setFieldValue: (fieldName: string, fieldValue: FieldValue) => void;
  onSubmit: (source: Metaform) => void;
  onValidationErrorsChange?: (validationErrors: ValidationErrors) => void;
}

/**
 * Component state
 */
interface State {
  uploadingFields: string[];
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
      uploadingFields: []
    };
  }

  /**
   * Component render method
   */
  public render = () => {
    const { classes, metaform, onValidationErrorsChange } = this.props;

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
          renderAutocomplete={ this.renderAutocomplete }
          uploadFile={ this.uploadFile }
          onFileDelete={ this.deleteFile }
          onFileShow={ this.showFile }
          renderIcon={ this.renderIcon }        
          renderSlider={ this.renderSlider }
          onSubmit={ this.props.onSubmit }
          onValidationErrorsChange={ onValidationErrorsChange }
          renderBeforeField={(fieldname) => {
            if (fieldname && this.state.uploadingFields.indexOf(fieldname) > -1) {
              return (<LinearProgress />);
            }
          }}
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
   * Renders slider field
   * 
   * @param fieldName field name
   * @param readOnly whether the field is read only
   */
  private renderSlider = (fieldName: string, readOnly: boolean) => {
    const { setFieldValue } = this.props; 
    const field = this.getField(fieldName);
    if (!field) {
      return null;
    }

    const value = this.props.getFieldValue(fieldName);
    
    return (
      <Slider 
        step={ field.step }
        max={ field.max }
        min={ field.min }
        name={ field.name }
        placeholder={ field.placeholder }
        disabled={ readOnly }
        value={ value as number }
        onChange={ (_event: React.ChangeEvent<{}>, value: number | number[]) => {
          setFieldValue(fieldName, value as number);
        }}
      />
    );
  }

  /**
   * Renders autocomplete component
   * 
   * @param field field
   * @param onChange onChange
   */
  private renderAutocomplete = (field: MetaformField) => {
    const { classes, metaform, setFieldValue } = this.props;

    // TODO: Error handling
    
    return (
      <FormAutocomplete
        classes={ classes }
        minSearchLength={ 3 }
        searchInterval={ 300 }
        field={ field }
        metaform={ metaform }
        onError={ e => /* TODO */ {} }
        setFieldValue={ setFieldValue }
      />
    );
  }

  /**
   * Finds a field from form by field name
   * 
   * @param fieldName field name
   * @returns field or null if not found
   */
  private getField = (fieldName: string) => {
    const { metaform } = this.props;

    return (metaform.sections || [])
      .flatMap(section => section.fields || [])
      .find(field => field.name === fieldName);
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

  /**
   * Performs file upload request
   * 
   * @param fieldName field name
   * @param file file to upload
   * @param path upload path
   */
  private doUpload(fieldName: string, file: File, path: string) {
    this.setState({
      uploadingFields: [...this.state.uploadingFields, fieldName]
    });
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
        persisted: false,
        name: data.fileName,
        url: this.createDefaultFileUrl(data.fileRef)
      } as FileFieldValueItem;
      (currentFiles as FileFieldValue).files.push(value);
      this.props.setFieldValue(fieldName, {...currentFiles as FileFieldValue});
      this.setState({
        uploadingFields: this.state.uploadingFields.filter(f => f !== fieldName)
      });
    })
    .catch((e) => {
      this.setState({
        uploadingFields: this.state.uploadingFields.filter(f => f !== fieldName)
      });
    })
  }

  /**
   * Creates url with default format for accessing uploaded file
   * 
   * @param id fileRef id
   */
  private createDefaultFileUrl = (id: string): string => {
    return `${Api.createDefaultUploadUrl()}?fileRef=${id}`;
  }

  /**
   * Deletes uploaded file
   * Only unsecure (not yet persisted) files can be deleted, otherwise they are just removed from data
   * 
   * @param fieldName field name
   * @param value uploaded value
   */
  private deleteFile = (fieldName: string, value: FileFieldValueItem) => {
    let currentFiles = this.props.getFieldValue(fieldName);
    if (!currentFiles) {
      currentFiles = { files: [] };
    }
    const files = (currentFiles as FileFieldValue).files.filter(f => f.id !== value.id);
    this.props.setFieldValue(fieldName, { files });
    
    //Only unsecured values can be deleted from server
    if (!value.persisted) {
      fetch(this.createDefaultFileUrl(value.id), { method: "DELETE" })
        .then((res) => {
          if (res.ok) {
            console.log("Deleted from server");
          }
        })
    }
  }

  /**
   * Shows uploaded file
   * 
   * @param fieldName field name
   * @param value uploaded value
   */
  private showFile = async (fieldName: string, value: FileFieldValueItem) => {
    if (!value.persisted) {
      window.open(value.url, "blank");
      return
    }
    if (this.props.accessToken) {
      const attachmentApi = Api.getAttachmentsApi(this.props.accessToken);
      const data = await attachmentApi.findAttachmentData({attachmentId: value.id, ownerKey: this.props.ownerKey});
      Utils.downloadBlob(data, value.name || "attachment");
    }
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
