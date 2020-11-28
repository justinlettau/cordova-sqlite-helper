import { SQLitePrepared } from './interfaces';
import { SQLiteUtility } from './sqlite-utility';

describe('SQLiteUtility prepare method', () => {
  it('should convert named params', () => {
    const result: SQLitePrepared = SQLiteUtility.prepare({
      sql: 'select * from Example where Name = @name and IsActive = @isActive',
      params: { name: 'test', isActive: true },
    });

    expect(result[0]).toEqual(
      'select * from Example where Name = ? and IsActive = ?'
    );
    expect(result[1]).toEqual(['test', 1]);
  });

  it('should transform array to list', () => {
    const result: SQLitePrepared = SQLiteUtility.prepare({
      sql: 'select * from Example where Id in (@ids)',
      params: { ids: [1, 2, 3] },
    });

    expect(result[0]).toEqual('select * from Example where Id in (?,?,?)');
    expect(result[1]).toEqual([1, 2, 3]);
  });

  it('should transform undefined to null', () => {
    const result: SQLitePrepared = SQLiteUtility.prepare({
      sql: 'select * from Example where Name = @name',
      params: { name: undefined },
    });

    expect(result[0]).toEqual('select * from Example where Name = ?');
    expect(result[1]).toEqual([null]);
  });

  it('should transform boolean to bit', () => {
    const result: SQLitePrepared = SQLiteUtility.prepare({
      sql: 'select * from Example where IsActive = @isActive',
      params: { isActive: true },
    });

    expect(result[0]).toEqual('select * from Example where IsActive = ?');
    expect(result[1]).toEqual([1]);
  });

  it('should transform date to ISO string', () => {
    const now: Date = new Date();
    const result: SQLitePrepared = SQLiteUtility.prepare({
      sql: 'select * from Example where Date = @date',
      params: { date: now },
    });

    expect(result[0]).toEqual('select * from Example where Date = ?');
    expect(result[1]).toEqual([now.toISOString()]);
  });
});
