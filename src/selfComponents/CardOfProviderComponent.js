import React, {Component, useState} from 'react';
import InsertNewDocumentModalComponent from './InsertNewDocumentModalComponent'
import paginationFactory from "react-bootstrap-table2-paginator";
import cellEditFactory, {Type} from "react-bootstrap-table2-editor";
import BootstrapTable from "react-bootstrap-table-next";
import {ContextMenu, ContextMenuTrigger, MenuItem} from "react-contextmenu";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import './css/TableComponent.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
// import './css/CardOfProviderComponent.css';

import './css/CardOfProviderComponent.css';

class CardOfProviderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataAboutProvider: [],
            dataAboutDocuments: [],
            documentsTableId: undefined,
            editableRow: null,
            documentInsertModal: false // стейт, меняющийся на true при нажатии на карточке на кнопку добавить новый документ
        }
        this.appRoute = null;
    }

    async fetchFromProviderApi(data) {
        await fetch('/api/cardOfProvider', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            mode: "cors",
            body: JSON.stringify({DeliveryId: data}),
        }).then(results => results.json()
        ).then(data => {
            this.setState({
                dataAboutProvider: data[0],
            });
        }).catch((err) => {
            console.log(err, "cardOfProvider");
        });
    }

    async fetchFromDocumentsApi(providerId) {
        await fetch('/api/selectProvidersDocuments', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            mode: "cors",
            body: JSON.stringify({ProvidersId: providerId}),
        }).then(results => results.json()
        ).then(data => {
            console.log(data);
            let documentsTableId = data.map((val, ix) => {
                val.tableID = ix+1;
                // val.DateContract = moment(val.DateContract).format('YYYY-MM-DD');
                return val;
            });
            this.setState({
                documentsTableId: documentsTableId,
            });

            this.setState({
                dataAboutDocuments: data,
            });
        }).catch((err) => {
            console.log(err, "providersDocuments");
        });
    }


    async fetchOnDocumentsApi(apiRoute, rowEdit) {
        let jsonObj = {rowEdit: rowEdit, userId: localStorage.getItem('userId'), routeNumber: this.props.routeNumber, providerId: this.props.selectedProviderId}
        // console.log(jsonObj)
        console.log(apiRoute)
        console.log(this.props.url)
        await fetch(`${this.props.url}${apiRoute}`, {
            // await fetch('http://192.168.1.116:5000/api/test1', {
            method: 'POST',
            headers:{'content-type': 'application/json'},
            mode: "cors",
            body: JSON.stringify(jsonObj),
        }).then(results => {
            return results.json();
        }).catch((err) => {
            console.log(`${err}. Ошибка при отправке запроса на ${apiRoute}`);
        });
    }


    componentDidMount() {
        this.fetchFromProviderApi(this.props.selectedRowDeliveryId);
        this.appRoute = document.getElementById('globalDiv');
        this.fetchFromDocumentsApi(this.props.selectedProviderId);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.selectedProviderId !== prevProps.selectedProviderId) {
            this.fetchFromProviderApi(this.props.selectedRowDeliveryId);
        }
        if (this.state.dataAboutProvider !== prevState.dataAboutProvider) {
            console.log(this.state.dataAboutProvider);
            console.log(this.state.dataAboutProvider);
        }
    }

    selectHeaders(colName, columns) {
        for (const column of columns) {
            if (column.dataField === colName) {
                return column.text;
            }
        }
        return false;
    }

    changeDocumentState(){
        switch (this.state.documentInsertModal){
            case true:
                this.setState({documentInsertModal: false})
                break
            case false:
                this.setState({documentInsertModal: true})
                break
        }
    }

    editableTable(data, columns) {
        let trs = [];
        let columnName = false;
        for (const property in data) {
            // console.log(property, data[property])
            columnName = this.selectHeaders(property, columns)
            if (columnName) {
                if (this.state.editableRow === property) {
                    trs.push(
                        <tr>
                            <td>{columnName}</td>
                            <input
                                type="text"
                                ref={node => {
                                    this.editInput = node;
                                    if (this.editInput !== null) {
                                        this.editInput.focus();
                                    }
                                }}
                                onBlur={() => {
                                    data[property] = this.editInput.value;
                                    this.setState({
                                        editableRow: null,
                                        dataAboutProvider: data
                                    })
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        data[property] = this.editInput.value;
                                        this.setState({
                                            editableRow: null,
                                            dataAboutProvider: data
                                        })
                                    }
                                }}
                                defaultValue={data[property]}
                            />
                        </tr>
                    );
                } else {
                    trs.push(
                        <tr>
                            <td>{columnName}</td>
                            <td
                                onDoubleClick={() => {
                                    this.setState({
                                        editableRow: property,
                                    })
                                }}
                            >{data[property]}</td>
                        </tr>
                    );
                }
            }
        }

        return trs;
    }

    render() {

        // заголовки для таблицы контрагента
        const ProviderColumnsFields = [
        {
            dataField: 'Name',
            text: 'Название',
        }, {
            dataField: 'Contact',
            text: 'Контактная информация',
        }, {
            dataField: 'INN',
            text: 'ИНН',
        }];

        //заголовки для таблицы документов контрагентов
        const DocumentsColumnsFields = [
            {
                dataField: 'Name',
                text: 'Номер договора',
                headerStyle: (colum, colIndex) => {
                    return {width: 200, textAlign: 'center'};
                }
            }, {
                dataField: 'PaymentType',
                text: 'Тип оплаты',
                headerStyle: (colum, colIndex) => {
                    return {width: 200, textAlign: 'center'};
                }
            }, {
                dataField: 'StartDate',
                text: 'Дата заключения',
                editor: {
                    type: Type.DATE,
                    defaultValue: Date.now()
                },
                headerStyle: (colum, colIndex) => {
                    return {width: 100, textAlign: 'center'};
                }
            }, {
                dataField: 'EndDate',
                text: 'Дата окончания',
                editor: {
                    type: Type.DATE,
                    defaultValue: Date.now()
                },
                headerStyle: (colum, colIndex) => {
                    return {width: 200, textAlign: 'center'};
                }
            }, {
                dataField: 'Way',
                text: 'Путь до файла',
                headerStyle: (colum, colIndex) => {
                    return {width: 150, textAlign: 'center'};
                }
            },
            {
                dataField: 'DeliveryType',
                text: 'Тип поставки',
                headerStyle: (colum, colIndex) => {
                    return {width: 150, textAlign: 'center'};
                }
            },
            {
                dataField: 'UserName',
                text: 'Пользователь',
                headerStyle: (colum, colIndex) => {
                    return {width: 150, textAlign: 'center'};
                }
            },
            {
                dataField: 'DateUp',
                text: 'Дата внесения изменений',
                headerStyle: (colum, colIndex) => {
                    return {width: 150, textAlign: 'center'};
                }
            },
        ];

        const expandRow = {
            renderer: row => (
                <div>....</div>
            )
        };

        const indication = () => {
            return "В таблице нет информации";
        }

        return (
            <div id="grayBackgroundDiv">
                {/*<h1>Provider ID: {this.props.selectedProviderId}</h1>*/}
                <div id="cardOfProviderDiv">
                    {this.state.dataAboutProvider !== null &&
                    <div>
                        <h1>Карточка контрагента</h1>
                        {/*<h1>Карточка контрагента {this.state.dataAboutProvider[0].Name}</h1>*/}

                    <table>
                        {this.editableTable(this.state.dataAboutProvider, ProviderColumnsFields)}
                    </table>
                </div>}

                   <button className="buttonClose button7" onClick={() => {
                        this.props.closeWindowPortal();
                       // this.setState({documentInsertModal: false})

                       // this.appRoute.style.display = 'none';
                        // this.appRoute.style.overflowY = 'hidden';
                    }}>
                        Закрыть
                    </button>

                    <button className="button7" onClick={() => {
                        // this.setState({documentInsertModal: true})
                       this.changeDocumentState()

                    }}>
                        Добавить новый документ
                    </button>

                {/*<button onClick={() => this.props.closeWindowPortal()} >*/}
                {/*    Close me!*/}
                {/*</button>*/}
                <br/>
                    <br/>
                        <br/>
                    {this.state.documentInsertModal === false &&
                <ToolkitProvider
                    keyField={"tableID"}
                    data={this.state.dataAboutDocuments}
                    columns={DocumentsColumnsFields}
                    search
                    insertRow = {true}
                    deleteRow = {true}
                >
                    {
                        props => (
                            <BootstrapTable
                                // wrapperClasses="table-horiz-scroll"
                                // headerClasses="thead"
                                // bodyClasses="tbody"
                                noDataIndication={ indication }
                                cellEdit={cellEditFactory({
                                    mode: 'dbclick',
                                    // blurToSave: true,
                                    // onStartEdit: () => {console.log(document.activeElement);},
                                    afterSaveCell: (oldValue, newValue, row, column) => {

                                        if (oldValue !== newValue) {
                                            console.log(row);
                                            this.fetchOnDocumentsApi(`/api/updateProvidersDocuments`, row);
                                        }
                                    }
                                })}
                                {...props.baseProps}
                            />

                        )
                    }

                </ToolkitProvider>
                        }
                    {this.state.documentInsertModal === true &&
                        <InsertNewDocumentModalComponent/>
                    }
                </div>

            </div>
        )
    }
}

export default CardOfProviderComponent;