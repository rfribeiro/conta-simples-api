const assert = require('assert');
import PasswordHelper from '../../utils/PasswordHelper'

const SENHA = 'rafael@32123';
const HASH = '$2a$08$LsQ4mjMBctS6JSFSILkjeejzIDxJXAWukMMemgfry3DcCbY7ire1G'

describe('PasswordHelper test suite', function () {
    it('deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hash(SENHA);
        assert.ok(result.length > 10);
    });
    it('deve comparar uma senha e seu hash', async () => {
        const result = PasswordHelper.verify(SENHA, HASH)
        assert.ok(result)
    })
});