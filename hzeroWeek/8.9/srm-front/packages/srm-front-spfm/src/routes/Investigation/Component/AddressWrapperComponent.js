import React from 'react';
import { isFunction } from 'lodash';

export default class AddressAWrapperComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleRefEditComposeForm = this.handleRefEditComposeForm.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleRegionChange = this.handleRegionChange.bind(this);
    this.getRegionQueryParams = this.getRegionQueryParams.bind(this);
    this.getCityQueryParams = this.getCityQueryParams.bind(this);
  }

  state = {
    // 国家
    countryId: undefined,
    // 地区
    regionId: undefined,
  };

  handleRefEditComposeForm(composeForm) {
    const { refEditComposeForm } = this.props;
    this.composeForm = composeForm;
    if (isFunction(refEditComposeForm)) {
      refEditComposeForm(composeForm);
    }
  }

  handleCountryChange(countryId) {
    this.composeForm.props.form.setFieldsValue({
      regionId: undefined,
      cityId: undefined,
    });
    this.setState({ countryId });
  }

  handleRegionChange(regionId) {
    this.composeForm.props.form.setFieldsValue({
      cityId: undefined,
    });
    this.setState({ regionId });
  }

  getRegionQueryParams() {
    return {
      countryId: this.state.countryId,
    };
  }

  getCityQueryParams() {
    return {
      parentRegionId: this.state.regionId,
    };
  }

  render() {
    const { children } = this.props;
    return React.cloneElement(children, {
      context: this,
      ...this.props,
      refEditComposeForm: this.handleRefEditComposeForm,
    });
  }
}
