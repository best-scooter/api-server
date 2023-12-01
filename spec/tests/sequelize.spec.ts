import { QueryTypes } from 'sequelize';

import sequelize from '@src/orm/Sequelize';


// **** Variables **** //

// **** Tests **** //

describe('Database connection', () => {

    it('should return 1+1 = 2', async () => {
        const results = await sequelize.query('SELECT 1+1 AS result', { type: QueryTypes.SELECT });
    
        // @ts-ignore
        expect(results[0].result).toEqual(2);
    });
});
