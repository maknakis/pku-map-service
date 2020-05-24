import React, { Component } from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import './css/TableComponent.css';
import '../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css';


function rowClassNameFormat(row, rowIdx) {
    // console.log(row);
    return row['name'] === 'George Michael' ?
        'GeorgeMichael-Row' : 'Other-Row';
}

function getData() {
    let data = []
    for (let i = 0; i < 100; ++i) {
        data[i] = {id: i, name: 'item_' + i, value: i}
    }

    return data
}


function showTotal() {
    return <p>There are 100 items total</p>
}

class TableComponent extends Component {
    render() {
        const options = {
            page: 4,
            prePage:  '⟵',
            nextPage: '⟶',
            firstPage: '⟸',
            lastPage: '⟹',
            paginationShowsTotal: showTotal
        }
        const cellEditProp = {
            mode: 'dbclick',
            // nonEditableRows: function () {      // не работает
            //     return [1];
            // }
        }
        return (
            <div id="TableComp">
                {this.props.show &&
                    <div>
                        <p className="Table-header">Basic Table</p>
                        <BootstrapTable data={getData()}
                                        trClassName={rowClassNameFormat}
                                        pagination={true}
                                        options={options}
                                        cellEdit={cellEditProp}
                        >
                            <TableHeaderColumn isKey dataField='id'>
                                ID
                            </TableHeaderColumn>
                            <TableHeaderColumn dataField='name'>
                                Name
                            </TableHeaderColumn>
                            <TableHeaderColumn dataField='value'>
                                Value
                            </TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                }
                <p>{this.props.hide}</p>
            </div>
        );
    }
}

export default TableComponent;
