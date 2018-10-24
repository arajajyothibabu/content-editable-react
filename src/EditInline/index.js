import React from 'react';
import PropTypes from 'prop-types';

/**
 * Based on https://medium.com/@vraa/inline-edit-using-higher-order-components-in-react-7828687c120c
 */
export default function contentEditable(WrappedComponent) {

    return class extends React.Component {

        state = {
            editing: false
        };

        toggleEdit = (e) => {
            e.stopPropagation();
            if (this.state.editing) {
                this.cancel();
            } else {
                this.edit();
            }
        };

        componentWillReceiveProps(nextProps){
            const { inEditMode } = nextProps;
            if(inEditMode !== this.props.inEditMode){
                this.setState({editing: !!inEditMode});
            }
        }

        edit = () => {
            this.setState({editing: true}, this.domElm.focus);
        };

        save = () => {
            const { handleUpdate = () => null, value } = this.props;
            handleUpdate(value);
            this.setState({editing: false});
        };

        cancel = () => {
            this.setState({editing: false});
        };

        isValueChanged = () => {
            return this.props.value !== this.domElm.textContent
        };

        handleKeyDown = (e) => {
            const { key } = e;
            switch (key) {
                case 'Enter':
                    if(e.shiftKey){
                       break;
                    }
                case 'Escape':
                    this.save();
                    break;
            }
        };

        render() {
            const { editOnClick = true } = this.props;
            const { editing } = this.state;
            return (
                <WrappedComponent
                    className={editing ? 'editing' : ''}
                    onClick={editOnClick ? this.toggleEdit : undefined}
                    contentEditable={editing}
                    ref={(domNode) => {
                        this.domElm = domNode;
                    }}
                    onBlur={this.save}
                    onKeyDown={this.handleKeyDown}
                    {...this.props}
                >
                    {this.props.value}
                </WrappedComponent>
            )
        }
    }
}

contentEditable.propTypes = {
    editOnClick: PropTypes.bool,
    handleUpdate: PropTypes.func,
    inEditMode: PropTypes.bool
};