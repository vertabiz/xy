import { Range } from '@vertabiz/range-ref'
import test from 'ava'
import { CellRow } from './CellRow'
import DataGrid from './DataGrid'
import Region from './Region'

const TEST_DATA = Region.fromRows(
  [
    [{"type":"TEXT","value":"NAME"},{"type":"TEXT","value":"COLUMN"},{"type":"TEXT","value":"TYPE"},{"type":"TEXT","value":"VALUE"}],
    [{"type":"TEXT","value":"Amazon Visa"},{"type":"TEXT","value":"date"},{"type":"TEXT","value":"csv"},{"type":"TEXT","value":"Transaction Date"}],
    [{"type":"TEXT","value":"Amazon Visa"},{"type":"TEXT","value":"description"},{"type":"TEXT","value":"csv"},{"type":"TEXT","value":"Description"}],
    [{"type":"TEXT","value":"Amazon Visa"},{"type":"TEXT","value":"amount"},{"type":"TEXT","value":"csv"},{"type":"TEXT","value":"Amount"}],
    [{"type":"TEXT","value":"Amazon Visa"},{"type":"TEXT","value":"note"},{"type":"TEXT","value":"csv"},{"type":"TEXT","value":"Memo"}],
    [{"type":"TEXT","value":"Amazon Visa"},{"type":"TEXT","value":"transaction id"},{"type":"TEXT","value":"uuid"},{"type":"TEXT","value":""}],
    [{"type":"TEXT","value":"Amazon Visa"},{"type":"TEXT","value":"account"},{"type":"TEXT","value":"static"},{"type":"TEXT","value":"Amazon Card"}],
    [{"type":"TEXT","value":"Amazon Visa"},{"type":"TEXT","value":"account #"},{"type":"TEXT","value":"static"},{"type":"NUMBER","value":4967}],
    [{"type":"TEXT","value":"Amazon Visa"},{"type":"TEXT","value":"institution"},{"type":"TEXT","value":"static"},{"type":"TEXT","value":"Chase"}],
    [{"type":"TEXT","value":"Amazon Visa"},{"type":"TEXT","value":"currency"},{"type":"TEXT","value":"static"},{"type":"TEXT","value":"USD"}],
    [{"type":"TEXT","value":"Capital One - Checking"},{"type":"TEXT","value":"date"},{"type":"TEXT","value":"csv"},{"type":"TEXT","value":"Transaction Date"}],
    [{"type":"TEXT","value":"Capital One - Checking"},{"type":"TEXT","value":"description"},{"type":"TEXT","value":"csv"},{"type":"TEXT","value":"Transaction Description"}],
    [{"type":"TEXT","value":"Capital One - Checking"},{"type":"TEXT","value":"amount"},{"type":"TEXT","value":"csv"},{"type":"TEXT","value":"Transaction Amount"}],
    [{"type":"TEXT","value":"Capital One - Checking"},{"type":"TEXT","value":"transaction id"},{"type":"TEXT","value":"uuid"},{"type":"TEXT","value":""}],
    [{"type":"TEXT","value":"Capital One - Checking"},{"type":"TEXT","value":"account"},{"type":"TEXT","value":"static"},{"type":"TEXT","value":"Checking"}],
    [{"type":"TEXT","value":"Capital One - Checking"},{"type":"TEXT","value":"account #"},{"type":"TEXT","value":"static"},{"type":"TEXT","value":"xxxx5100"}],
    [{"type":"TEXT","value":"Capital One - Checking"},{"type":"TEXT","value":"institution"},{"type":"TEXT","value":"static"},{"type":"TEXT","value":"Capital One - Bank"}],
    [{"type":"TEXT","value":"Capital One - Checking"},{"type":"TEXT","value":"currency"},{"type":"TEXT","value":"static"},{"type":"TEXT","value":"USD"}],
    [{"type":"TEXT","value":"Apple Card"},{"type":"TEXT","value":"date"},{"type":"TEXT","value":"csv"},{"type":"TEXT","value":"Transaction Date"}],
    [{"type":"TEXT","value":"Apple Card"},{"type":"TEXT","value":"description"},{"type":"TEXT","value":"csv"},{"type":"TEXT","value":"Description"}],
    [{"type":"TEXT","value":"Apple Card"},{"type":"TEXT","value":"amount"},{"type":"TEXT","value":"expression"},{"type":"TEXT","value":"\"-\"+import[\"Amount (USD)\"]"}],
    [{"type":"TEXT","value":"Apple Card"},{"type":"TEXT","value":"transaction id"},{"type":"TEXT","value":"uuid"},{"type":"TEXT","value":""}],
    [{"type":"TEXT","value":"Apple Card"},{"type":"TEXT","value":"account"},{"type":"TEXT","value":"static"},{"type":"TEXT","value":"Apple Card"}],
    [{"type":"TEXT","value":"Apple Card"},{"type":"TEXT","value":"institution"},{"type":"TEXT","value":"static"},{"type":"TEXT","value":"Goldman Sachs"}],
    [{"type":"TEXT","value":"Apple Card"},{"type":"TEXT","value":"currency"},{"type":"TEXT","value":"static"},{"type":"TEXT","value":"USD"}],
    [{"type":"TEXT","value":"Capital One - Inflow/Outflow"},{"type":"TEXT","value":"date"},{"type":"TEXT","value":"csv"},{"type":"TEXT","value":"Transaction Date"}],
    [{"type":"TEXT","value":"Capital One - Inflow/Outflow"},{"type":"TEXT","value":"description"},{"type":"TEXT","value":"csv"},{"type":"TEXT","value":"Transaction Description"}],
    [{"type":"TEXT","value":"Capital One - Inflow/Outflow"},{"type":"TEXT","value":"outflow"},{"type":"TEXT","value":"expression"},{"type":"TEXT","value":"import[\"Transaction Amount\"] < 0 ? (import[\"Transaction Amount\"] * -1) : \"\""}],
    [{"type":"TEXT","value":"Capital One - Inflow/Outflow"},{"type":"TEXT","value":"inflow"},{"type":"TEXT","value":"expression"},{"type":"TEXT","value":"import[\"Transaction Amount\"] >= 0 ? import[\"Transaction Amount\"] : \"\""}],
    [{"type":"TEXT","value":"Capital One - Inflow/Outflow"},{"type":"TEXT","value":"transaction id"},{"type":"TEXT","value":"uuid"},{"type":"TEXT","value":""}],
    [{"type":"TEXT","value":"Capital One - Inflow/Outflow"},{"type":"TEXT","value":"account"},{"type":"TEXT","value":"static"},{"type":"TEXT","value":"Checking"}],
    [{"type":"TEXT","value":"Capital One - Inflow/Outflow"},{"type":"TEXT","value":"account #"},{"type":"TEXT","value":"static"},{"type":"TEXT","value":"xxxx5100"}],
    [{"type":"TEXT","value":"Capital One - Inflow/Outflow"},{"type":"TEXT","value":"institution"},{"type":"TEXT","value":"static"},{"type":"TEXT","value":"Capital One - Bank"}],
    [{"type":"TEXT","value":"Capital One - Inflow/Outflow"},{"type":"TEXT","value":"currency"},{"type":"TEXT","value":"static"},{"type":"TEXT","value":"USD"}],
    [{"type":"TEXT","value":"Capital One - Aspire"},{"type":"TEXT","value":"date"},{"type":"TEXT","value":"csv"},{"type":"TEXT","value":"Transaction Date"}],
    [{"type":"TEXT","value":"Capital One - Aspire"},{"type":"TEXT","value":"memo"},{"type":"TEXT","value":"csv"},{"type":"TEXT","value":"Transaction Description"}],
    [{"type":"TEXT","value":"Capital One - Aspire"},{"type":"TEXT","value":"outflow"},{"type":"TEXT","value":"expression"},{"type":"TEXT","value":"import[\"Transaction Amount\"] < 0 ? (import[\"Transaction Amount\"] * -1) : \"\""}],
    [{"type":"TEXT","value":"Capital One - Aspire"},{"type":"TEXT","value":"inflow"},{"type":"TEXT","value":"expression"},{"type":"TEXT","value":"import[\"Transaction Amount\"] >= 0 ? import[\"Transaction Amount\"] : \"\""}],
    [{"type":"TEXT","value":"Capital One - Aspire"},{"type":"TEXT","value":"uuid"},{"type":"TEXT","value":"uuid"},{"type":"TEXT","value":""}],
    [{"type":"TEXT","value":"Capital One - Aspire"},{"type":"TEXT","value":"account"},{"type":"TEXT","value":"static"},{"type":"TEXT","value":"💰 Checking"}],
    [{"type":"TEXT","value":""},{"type":"TEXT","value":""},{"type":"TEXT","value":""},{"type":"TEXT","value":""}],
    [{"type":"TEXT","value":""},{"type":"TEXT","value":""},{"type":"TEXT","value":""},{"type":"TEXT","value":""}],
    [{"type":"TEXT","value":""},{"type":"TEXT","value":""},{"type":"TEXT","value":""},{"type":"TEXT","value":""}],
  ] as CellRow[],
  Range.fromAddress("A1:D"),
)

test('with real-world dataset', t => {
  const grid = new DataGrid({
    headerRange: Range.fromAddress('A1:1'),
    regions: [
      TEST_DATA,
    ]
  })

  const records = grid.getRecords()
  t.deepEqual(records.length, 42)
})