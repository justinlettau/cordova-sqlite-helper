import { SqliteNamedParams, SqlitePrepareResult } from './interfaces';
import prepare from './prepare';

describe('prepare method', () => {

  it('should convert named params', () => {
    const sql: string = 'select * from Example where Name = @name and IsActive = @isActive';
    const params: SqliteNamedParams = { name: 'test', isActive: true };
    const result: SqlitePrepareResult = prepare(sql, params);

    expect(result[0]).toEqual('select * from Example where Name = ? and IsActive = ?');
    expect(result[1]).toEqual(['test', 1]);
  });

  it('should transform array to list', () => {
    const sql: string = 'select * from Example where Id in (@ids)';
    const params: SqliteNamedParams = { ids: [1, 2, 3] };
    const result: SqlitePrepareResult = prepare(sql, params);

    expect(result[0]).toEqual('select * from Example where Id in (?,?,?)');
    expect(result[1]).toEqual([1, 2, 3]);
  });

  it('should transform undefined to null', () => {
    const sql: string = 'select * from Example where Name = @name';
    const params: SqliteNamedParams = { name: undefined };
    const result: SqlitePrepareResult = prepare(sql, params);

    expect(result[0]).toEqual('select * from Example where Name = ?');
    expect(result[1]).toEqual([null]);
  });

  it('should transform boolean to bit', () => {
    const sql: string = 'select * from Example where IsActive = @isActive';
    const params: SqliteNamedParams = { isActive: true };
    const result: SqlitePrepareResult = prepare(sql, params);

    expect(result[0]).toEqual('select * from Example where IsActive = ?');
    expect(result[1]).toEqual([1]);
  });

  it('should transform date to ISO string', () => {
    const now: Date = new Date();
    const sql: string = 'select * from Example where Date = @date';
    const params: SqliteNamedParams = { date: now };
    const result: SqlitePrepareResult = prepare(sql, params);

    expect(result[0]).toEqual('select * from Example where Date = ?');
    expect(result[1]).toEqual([now.toISOString()]);
  });

});
