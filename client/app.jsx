/**
 * @template S
 * @typedef {[S, React.Dispatch<React.SetStateAction<S>>]} State
 */

/**
 * @param {Object} props
 * @param {string=} props.type
 * @param {string} props.label
 * @param {string=} props.id
 * @param {string=} props.min
 * @param {string=} props.max
 * @param {State<string>} props.state
 */
const TextInput = ({type, label, id, min, max, state: [get, set]}) => {
  id = id || name.toLowerCase();
  const element = (
    <input
      type={type || 'text'}
      id={id}
      name={id}
      autoComplete={id}
      value={get}
      onChange={(event) => set(event.target.value)}
      min={min}
      max={max}
      required
    />
  );
  return label ? (
    <tr>
      <td>
        <label for={id}>{label}</label>
      </td>
      <td>
        {element}
      </td>
    </tr>
  ) : element;
};

/**
 * @param {Object} props
 * @param {() => any} props.onSubmit
 * @param {State<number>} props.buttonLabel
 * @param {React.ReactChildren} props.children
 */
const FormPage = (props) => (
  <form onSubmit={(event) => { event.preventDefault(); props.onSubmit(); }}>
    <table>
      <tbody>
        {props.children}
        <tr>
          <td>
            <input type="submit" value={props.buttonLabel}/>
          </td>
        </tr>
      </tbody>
    </table>
  </form>
);

/**
 * @param {Object} props
 * @param {(Object) => any} props.onSubmit
 */
const F1 = (props) => {
  const name = React.useState('');
  const email = React.useState('');
  const password = React.useState('');

  const submit = () => props.onSubmit({
    name,
    email,
    password
  });

  return (
    <FormPage buttonLabel='Next' onSubmit={submit}>
      <TextInput label='Name' state={name}/>
      <TextInput label='Email' type='email' state={email}/>
      <TextInput
        type='password'
        label='Password'
        id='new-password'
        state={password}
      />
    </FormPage>
  );
};

/**
 * @param {Object} props
 * @param {number} props.id
 * @param {(Object) => any} props.onSubmit
 */
const F2 = (props) => {
  const line1 = React.useState('');
  const line2 = React.useState('');
  const city = React.useState('');
  const state = React.useState('');
  const zipcode = React.useState('');
  const phone = React.useState('');

  const submit = () => props.onSubmit({
    id: [props.id],
    line1,
    line2,
    city,
    state,
    zipcode,
    phone
  });

  return (
    <FormPage buttonLabel='Next' onSubmit={submit}>
      <TextInput label='Address Line 1' id='address-line1' state={line1}/>
      <TextInput label='Address Line 2' id='address-line2' state={line2}/>
      <TextInput label='City' id='address-level2' state={city}/>
      <TextInput label='State' id='address-level1' state={state}/>
      <TextInput label='ZIP Code' id='postal-code' state={zipcode}/>
      <TextInput label='Phone' type='tel' state={phone}/>
    </FormPage>
  );
};

const currentYear = new Date().getFullYear().toString();

/**
 * @param {Object} props
 * @param {number} props.id
 * @param {(Object) => any} props.onSubmit
 */
const F3 = (props) => {
  const ccNumber = React.useState('');
  const ccMonth = React.useState('1');
  const ccYear = React.useState(currentYear);
  const ccCVV = React.useState('');
  const ccZipcode = React.useState('');

  const submit = () => props.onSubmit({
    id: [props.id],
    ccNumber,
    ccExpiry: [new Date(ccYear[0], ccMonth[0])],
    ccCVV,
    ccZipcode
  });

  return (
    <FormPage buttonLabel='Checkout' onSubmit={submit}>
      <TextInput
        label='Credit Card'
        type='number'
        id='cc-number'
        max='9999999999999999'
        state={ccNumber}
      />
      <tr>
        <td>
          <label>Expiration Date</label>
        </td>
        <td>
          <TextInput
            type='number'
            id='cc-exp-month'
            min='1'
            max='12'
            state={ccMonth}
          />
          <TextInput
            type='number'
            id='cc-exp-year'
            min={currentYear}
            state={ccYear}
          />
        </td>
      </tr>
      <TextInput
        label='CVV'
        type='number'
        id='cc-csc'
        max='999'
        state={ccCVV}
      />
      <TextInput
        label='Billing Address ZIP code'
        type='number'
        id='postal-code'
        max='99999'
        state={ccZipcode}
      />
    </FormPage>
  );
};

const App = () => {
  const [page, setPage] = React.useState(0);
  const [id, setId] = React.useState(null);

  const update = (form) => {
    console.log(form);
    for (const key in form) {
      form[key] = form[key][0];
    }
    const req = new XMLHttpRequest();
    req.open('POST', '/', true);
    req.onload = (event) => {
      setId(Number(event.target.response));
      setPage(page => (page + 1) % 3);
    };
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.send(JSON.stringify(form));
  };

  if (page === 0) {
    return (
      <F1 onSubmit={update}/>
    );
  } else if (page === 1) {
    return (
      <F2 onSubmit={update} id={id}/>
    );
  } else {
    return (
      <F3 onSubmit={update} id={id}/>
    );
  }
};

ReactDOM.render(<App />, document.getElementById('app'));
