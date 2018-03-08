import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class Select extends React.Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    
    let { label, options, selected } = this.props; 
    
    this.state = {
      dropdownOpen: false,
      label,
      options,
      selectedOption : selected,
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
    if(this.props.search) this.searchRef.focus();
  }

  searchValue(){
    
    let _searchValue = this.searchRef.value;
    _searchValue = _searchValue.toLowerCase();
    
    if(_searchValue == ""){
      this.setState({
        ...this.state,
        options: this.props.options
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
    let { label, options, selectedOption } = this.state;
    
    if(selectedOption != null){
      selectedOption = options.find(option => option.value == selectedOption);
      label = selectedOption.label ? selectedOption.label : selectedOption.value;
    }

    const mappedOptions = options.map((option,i) =>{
      const styleItem = {
        visibility: option.value == this.state.selectedOption ? "visible" : "hidden"
      } 
      return (
        <DropdownItem key={i} onClick={this.onClickOption.bind(this, option)}>
          <i className="icon-check" style={styleItem}/>
          {option.label ? option.label : option.value}</DropdownItem>
      );
    });

    return (
      <ButtonDropdown direction="down" isOpen={this.state.dropdownOpen} toggle={this.toggle} style={{width: this.props.width}}>
        <DropdownToggle size={this.props.size} style={{width: "100%"}}>
          <div className="col-xs-10 pull-left">
            {label}
          </div>
          <div className="col-xs-2  pull-right">
            <i className="icon-arrow-down"/>
          </div>
        </DropdownToggle>
        <DropdownMenu style={{width: "100%"}}>
          { this.props.search &&
            <input
              key="search"
              ref={(_this) => this.searchRef = _this} 
              type="text" 
              className="form-control" 
              onChange={this.searchValue.bind(this)}
              placeholder="Search here"
            />
          }
          <div style={{
                width: "100%",
                height: 'auto',
                maxHeight: '200px',
                overflowX: 'hidden'
            }}>
            {mappedOptions}
          </div>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

Select.defaultProps = {
  label: "Select an option",
  options: [],
  width: "100%",
  search: false,
  selected: null,
  size: "lg"
}