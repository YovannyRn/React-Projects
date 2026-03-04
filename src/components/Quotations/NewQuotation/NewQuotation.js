import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

const initialState = {
  quotationNumber: "",
  supplierName: "",
  status: "Draft",
  totalAmount: "",
  currency: "USD",
  deliveryTime: "",
  deliveryTerms: "",
  paymentTerms: "",
  validUntil: "",
  internalNotes: "",
  supplierComments: "",
  transportCost: "",
  evaluationScore: "",
  termsAccepted: false,
  competitivePosition: "",
};

const statusOptions = [
  "Draft",
  "Sent",
  "Received",
  "Under Review",
  "Accepted",
  "Rejected",
  "Expired",
];
const currencyOptions = ["USD", "EUR", "GBP", "MXN", "JPY"];

const NewQuotation = ({ show, onClose, onCreateQuotation }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [items, setItems] = useState([
    { description: "", quantity: 1, unitPrice: "", taxes: "", totalPrice: "" },
  ]);

  const handleItemChange = (idx, e) => {
    const { name, value } = e.target;
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [name]: value } : item)),
    );
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        description: "",
        quantity: 1,
        unitPrice: "",
        taxes: "",
        totalPrice: "",
      },
    ]);
  };

  const removeItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validObjectId = (id) =>
      typeof id === "string" && id.length === 24 && /^[a-fA-F0-9]+$/.test(id);

    const DEFAULT_OBJECT_ID = "6650e2132321312312312312";

    const newQuotation = {
      ...form,
      id: Math.random().toString(36).substr(2, 9),
      quotationNumber:
        form.quotationNumber || `Q-${Math.floor(Math.random() * 10000)}`,
      quotationRequestId: validObjectId(form.quotationRequestId)
        ? form.quotationRequestId
        : DEFAULT_OBJECT_ID,
      supplierId: validObjectId(form.supplierId)
        ? form.supplierId
        : DEFAULT_OBJECT_ID,
      responsibleId: validObjectId(form.responsibleId)
        ? form.responsibleId
        : DEFAULT_OBJECT_ID,
      supplierName: form.supplierName || "Proveedor X",
      status: form.status || "Draft",
      totalAmount: { $numberDecimal: String(form.totalAmount || "0") },
      currency: form.currency || "USD",
      deliveryTime: Number(form.deliveryTime) || 0,
      deliveryTerms: form.deliveryTerms || "",
      paymentTerms: form.paymentTerms || "",
      validUntil: form.validUntil
        ? new Date(form.validUntil).toISOString()
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      creationDate: new Date().toISOString(),
      sentDate: null,
      receivedDate: null,
      reviewDate: null,
      items: (items.length
        ? items
        : [
            {
              description: "",
              quantity: 1,
              unitPrice: "0",
              taxes: "0",
              totalPrice: "0",
            },
          ]
      ).map((item, idx) => ({
        itemId: Math.random().toString(36).substr(2, 9),
        description: item.description || "",
        quantity: Number(item.quantity) || 1,
        unitPrice: { $numberDecimal: String(item.unitPrice || "0") },
        taxes: { $numberDecimal: String(item.taxes || "0") },
        totalPrice: { $numberDecimal: String(item.totalPrice || "0") },
        discount: { $numberDecimal: "0" },
      })),
      attachments: [],
      internalNotes: form.internalNotes || "",
      supplierComments: form.supplierComments || "",
      transportCost: { $numberDecimal: String(form.transportCost || "0") },
      additionalCosts: [],
      communicationHistory: [],
      evaluationScore: { $numberDecimal: String(form.evaluationScore || "0") },
      termsAccepted: !!form.termsAccepted,
      competitivePosition: Number(form.competitivePosition) || 0,
      lastReminder: null,
      createdBy: "Usuario A",
      updatedBy: "Usuario A",
      updatedAt: new Date().toISOString(),
    };

    await onCreateQuotation(newQuotation);
    setLoading(false);
    setForm(initialState);
    setItems([
      {
        description: "",
        quantity: 1,
        unitPrice: "",
        taxes: "",
        totalPrice: "",
      },
    ]);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <AddCircleOutlineIcon className="me-2 text-success" />
          New Quotation
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Quotation Number</Form.Label>
                <Form.Control
                  type="text"
                  name="quotationNumber"
                  value={form.quotationNumber}
                  onChange={handleChange}
                  required
                  placeholder="Q-XXXX"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Supplier Name</Form.Label>
                <Form.Control
                  type="text"
                  name="supplierName"
                  value={form.supplierName}
                  onChange={handleChange}
                  required
                  placeholder="Supplier Name"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Total Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="totalAmount"
                  value={form.totalAmount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Currency</Form.Label>
                <Form.Select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                >
                  {currencyOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Delivery Time (days)</Form.Label>
                <Form.Control
                  type="number"
                  name="deliveryTime"
                  value={form.deliveryTime}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g. 7"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Delivery Terms</Form.Label>
                <Form.Control
                  type="text"
                  name="deliveryTerms"
                  value={form.deliveryTerms}
                  onChange={handleChange}
                  placeholder="e.g. FOB"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Payment Terms</Form.Label>
                <Form.Control
                  type="text"
                  name="paymentTerms"
                  value={form.paymentTerms}
                  onChange={handleChange}
                  placeholder="e.g. 30 days"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Valid Until</Form.Label>
                <Form.Control
                  type="date"
                  name="validUntil"
                  value={form.validUntil}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Internal Notes</Form.Label>
                <Form.Control
                  type="text"
                  name="internalNotes"
                  value={form.internalNotes}
                  onChange={handleChange}
                  placeholder="Notas internas"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Supplier Comments</Form.Label>
                <Form.Control
                  type="text"
                  name="supplierComments"
                  value={form.supplierComments}
                  onChange={handleChange}
                  placeholder="Comentarios del proveedor"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Transport Cost</Form.Label>
                <Form.Control
                  type="number"
                  name="transportCost"
                  value={form.transportCost}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Evaluation Score</Form.Label>
                <Form.Control
                  type="number"
                  name="evaluationScore"
                  value={form.evaluationScore}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Competitive Position</Form.Label>
                <Form.Control
                  type="number"
                  name="competitivePosition"
                  value={form.competitivePosition}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Terms Accepted"
                  name="termsAccepted"
                  checked={form.termsAccepted}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <h6 className="mb-2">Items</h6>
          {items.map((item, idx) => (
            <Row className="mb-2" key={idx}>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, e)}
                    placeholder="Description"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, e)}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="unitPrice"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(idx, e)}
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Tax (IVA)</Form.Label>
                  <Form.Control
                    type="number"
                    name="taxes"
                    min="0"
                    step="0.01"
                    value={item.taxes}
                    onChange={(e) => handleItemChange(idx, e)}
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Total Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalPrice"
                    min="0"
                    step="0.01"
                    value={item.totalPrice}
                    onChange={(e) => handleItemChange(idx, e)}
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
              <Col md={1} className="d-flex align-items-end">
                {items.length > 1 && (
                  <Button
                    variant="danger mt-1"
                    size="sm"
                    onClick={() => removeItem(idx)}
                  >
                    <DeleteRoundedIcon />
                  </Button>
                )}
              </Col>
            </Row>
          ))}
          <Button
            variant="outline-primary"
            size="sm"
            onClick={addItem}
            style={{ marginBottom: 10 }}
          >
            + Add Item
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            style={{ borderRadius: "10px" }}
          >
            <CloseIcon className="me-1" /> Cancel
          </Button>
          <Button
            variant="success"
            type="submit"
            disabled={loading}
            style={{ borderRadius: "10px", fontWeight: "bold" }}
          >
            <AddCircleOutlineIcon className="me-1" />{" "}
            {loading ? "Saving..." : "Add Quotation"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default NewQuotation;
