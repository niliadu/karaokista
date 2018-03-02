import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class Select extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    
    let { label, options, width, search } = this.props; 
    
    if(!label) label = "Select an option";
    if(!options) options = [];
    if(!width) width = "100%";
    search = !search ? false : true;
    

    this.state = {
      dropdownOpen: false,
      label,
      options,
      defaultOptions: options,
      width,
      selectedOption: "",
      search
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  onClickOption(option){
    this.setState({
      ...this.state,
      selectedOption: option.value,
      label: option.label ? option.label : option.value
    });
    this.toggle();

    if(this.props.handler) this.props.handler(option.value);
  }  

  componentDidUpdate(){
    if(this.state.search) this.searchRef.focus();
  }

  searchValue(){
    
    let _searchValue = this.searchRef.value;
    _searchValue = _searchValue.toLowerCase();
    
    if(_searchValue == ""){
      this.setState({
        ...this.state,
        options: this.state.defaultOptions
      });

      return;
    }

    let newOptions = this.state.options.filter(option => {
      let _string = option.label ? option.label : option.value;
      _string = _string.toLowerCase();
      
      return _string.indexOf(_searchValue) !== -1;
    });
    
    this.setState({
      ...this.state,
      options: newOptions
    });
  }

  render() {
    let { label, options, search } = this.state;
    
    const dropdownListStyle = {
      width: this.state.width,
      height: 'auto',
      maxHeight: '200px',
      overflowX: 'hidden'
    };

    const mappedOptions = options.map((option,i) =>{
      return (
        <DropdownItem key={i} onClick={this.onClickOption.bind(this, option)}>{option.label ? option.label : option.value}</DropdownItem>
      );
    });

    return (
      <ButtonDropdown direction="down" isOpen={this.state.dropdownOpen} toggle={this.toggle} style={{width: this.state.width}}>
        <DropdownToggle size="lg" style={{width: this.state.width}}>
          <div className="col-xs-10 pull-left">
            {label}
          </div>
          <div className="col-xs-2  pull-right">
            <i className="icon-arrow-down"/>
          </div>
        </DropdownToggle>
        <DropdownMenu  style={{width: this.state.width}}>
          { this.state.search &&
            <input
              key="search"
              ref={(_this) => this.searchRef = _this} 
              type="text" 
              className="form-control" 
              onChange={this.searchValue.bind(this)}
              placeholder="Search here"
            />
          }
          <div style={dropdownListStyle}>
            {mappedOptions}
          </div>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}