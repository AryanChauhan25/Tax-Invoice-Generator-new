import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'

function GenerateInvoice() {
  html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [612, 792]
    });
    pdf.internal.scaleFactor = 1;
    const imgProps= pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('invoice-001.pdf');
  });
}

class InvoiceModal extends React.Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div>
        <Modal show={this.props.showModal} onHide={this.props.closeModal} size="lg" centered>
          <div id="invoiceCapture">
            <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
              <div className="w-100">
                <h4 className="fw-bold my-2">{this.props.info.billFrom||'Aryan Chauhan'}</h4>
                <h6 className="fw-bold text-secondary mb-1">
                  Invoice #: {this.props.info.invoiceNumber||''}
                </h6>
              </div>
              <div className="text-end ms-4">
                <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
                <h5 className="fw-bold text-secondary"> {this.props.currency} {this.props.total}</h5>
              </div>
            </div>
            <div className="p-4">
              <Row className="mb-4">
                <Col md={6}>
                  <div className="fw-bold">Billed to:</div>
                  <div>{this.props.info.billTo||''}</div>
                  <div>{this.props.info.billToAddress||''}</div>
                  <div>{this.props.info.billToEmail||''}</div>
                  <div>GSTIN {this.props.info.billToGSTIN||''}</div>
                </Col>
                <Col md={6}>
                  <div className="fw-bold">Billed From:</div>
                  <div>{this.props.info.billFrom||''}</div>
                  <div>{this.props.info.billFromAddress||''}</div>
                  <div>{this.props.info.billFromEmail||''}</div>
                  <div>GSTIN {this.props.info.billFromGSTIN||''}</div>
                </Col>
                <Col md={6}>
                  <div className="fw-bold mt-2">Invoice Date:<span className="fw-normal ms-2">{this.props.info.dateOfInvoice||''}</span></div>
                </Col>
                <Col md={6}>
                  <div className="fw-bold mt-2">Due Date:<span className="fw-normal ms-2">{this.props.info.dateOfDue||''}</span></div>
                </Col>
                {this.props.info.placeOfSupply &&
                  <Col md={4}>
                    <div className="fw-bold mt-2">Place of Supply:<span className="fw-normal ms-2">{this.props.info.placeOfSupply||''}</span></div>
                </Col>
                }
              </Row>
              <Table className="mb-0">
                <thead>
                  <tr>
                    <th>ITEM - DESCRIPTION</th>
                    <th>QTY</th>
                    <th>PRICE</th>
                    <th>SGST</th>
                    <th>CGST</th>
                    <th>CESS</th>
                    <th className="text-end">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.items.map((item, i) => {
                    return (
                      <tr id={i} key={i}>
                        <td>
                          {item.name} - {item.description}
                        </td>
                        <td style={{width: '60px'}}>
                          {item.quantity}
                        </td>
                        <td style={{width: '100px'}}>
                          {this.props.currency} {item.price}
                        </td>
                        <td style={{width: '100px'}}>
                          {this.props.currency} 
                          {(parseFloat(item.sgst).toFixed(2) * ((parseFloat(item.price).toFixed(2) * parseInt(item.quantity)) / 100))} 
                          <br/>
                          ({item.sgst})%
                        </td>
                        <td style={{width: '100px'}}>
                          {this.props.currency} 
                          {(parseFloat(item.cgst).toFixed(2) * ((parseFloat(item.price).toFixed(2) * parseInt(item.quantity)) / 100))}
                          <br/>
                          ({item.cgst})%
                        </td>
                        <td style={{width: '100px'}}>
                          {this.props.currency} 
                          {(parseFloat(item.cess).toFixed(2) * ((parseFloat(item.price).toFixed(2) * parseInt(item.quantity)) / 100))}
                          <br/>
                          ({item.cess})%
                        </td>
                        <td className="text-end" style={{width: '100px'}}>
                          {this.props.currency} {item.price * item.quantity}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Table>
                <tbody>
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{width: '100px'}}>SUBTOTAL</td>
                    <td className="text-end" style={{width: '100px'}}>{this.props.currency} {this.props.subTotal}</td>
                  </tr>
                  {this.props.discountAmmount !== 0.00 &&
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{width: '100px'}}>DISCOUNT</td>
                      <td className="text-end" style={{width: '100px'}}>({this.props.info.discountRate || 0}%){this.props.currency} {this.props.discountAmmount}</td>
                    </tr>
                  }
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{width: '100px'}}>TOTAL</td>
                    <td className="text-end" style={{width: '100px'}}>{this.props.currency} {this.props.total}</td>
                  </tr>
                </tbody>
              </Table>
              {this.props.info.notes &&
                <div className="bg-light py-3 px-4 rounded">
                  <h5>Notes:</h5>
                  {this.props.info.notes}
                </div>}
                {this.props.info.termsAndConditions &&
                <div className="bg-light py-3 px-4 rounded mt-4">
                  <h5>Terms and Conditions:</h5>
                  {this.props.info.termsAndConditions}
                </div>}
            </div>
          </div>
          <div className="pb-4 px-4">
            <Row>
              <Col md={6}>
                <Button variant="primary" className="d-block w-100" onClick={GenerateInvoice}>
                  <BiPaperPlane style={{width: '15px', height: '15px', marginTop: '-3px'}} className="me-2"/>Send Invoice
                </Button>
              </Col>
              <Col md={6}>
                <Button variant="outline-primary" className="d-block w-100 mt-3 mt-md-0" onClick={GenerateInvoice}>
                  <BiCloudDownload style={{width: '16px', height: '16px', marginTop: '-3px'}} className="me-2"/>
                  Download Copy
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
        <hr className="mt-4 mb-3"/>
      </div>
    )
  }
}

export default InvoiceModal;
