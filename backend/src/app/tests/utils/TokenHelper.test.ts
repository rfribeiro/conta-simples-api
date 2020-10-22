const assert = require('assert');
import TokenHelper from '../../utils/TokenHelper';

const ID = 'rafael@32123';

describe.only('TokenHelper test suite', function () {
    it('deve gerar um hash a partir de uma senha', async () => {
        const result = await TokenHelper.generate({id : ID});
        assert.ok(result.length > 10);
    });
    it('verificar o reset token', async () => {
        const result = await TokenHelper.generateReset();
        console.log(result)
        assert.ok(result.length === 20*2);
    });
    it('verificar o token recebido', async () => {
        const resultToken = await TokenHelper.generate({id : ID});

        const resultVerify = await TokenHelper.verify(resultToken);

        assert.equal(resultVerify.id, ID)
    });
});