import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import {getRootFromMnemonic, getHDSegwitFromRootWithPath, getPriKeyFromRoot, getMultiSigAddress} from './js/utils/utils';

test('Renders index.html button successfully.', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Generate your bitcoin address!/i);
  expect(linkElement).toBeInTheDocument();
});

test('Validate the generated HD Segwit address.', async () => {
  const mnemonic = 'blast alien clever abstract combine news shock vacant pigeon cloud comic clip farm play jeans genuine february book cake heavy coyote foil private subway'
  const root = await getRootFromMnemonic(mnemonic)
  const address = await getHDSegwitFromRootWithPath(root, "m/84'/0'/0'/0/0")
  expect(address.pubAddress).toBe('bc1qnqs99rzysvhyn0dpa7ms93rtvv6lqv0l3204t3');
});

test('Validate the generated multisig address.', async () => {
  const pubkeys = [
    '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
    '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
    '023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59',
  ]
  const multiSigAddress = getMultiSigAddress(pubkeys, 2)
  expect(multiSigAddress).toBe('3DQoEFJEWqJYqmrkdV5gPRNrnZv9ompoEr');
});
