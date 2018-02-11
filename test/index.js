import mitt from '../src';
import chai, { expect } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

it('should default export be a function', () => {
	expect(mitt).to.be.a('function');
});

describe('mitt#', () => {
	let events, inst, bar =()=>{}, foo = ()=>{};

	beforeEach( () => {
		events = Object.create(null);
		inst = mitt(events);
	});

	describe('on()', () => {
		it('should be a function', () => {
			expect(inst)
				.to.have.property('on')
				.that.is.a('function');
		});

		it('should register handler for new type', () => {

			inst.on('foo', foo);

			expect(events).to.have.property('foo');
		});

		it('should register handler', () => {
			inst.on('foo', foo);
			let evt = events['foo'];
			expect(evt[0]).to.have.property('handler').that.deep.equals(foo);
		});

		it('should register handlers for any type strings', () => {
			inst.on('constructor', foo);
			let evt = events['constructor'];
			expect(evt[0]).to.have.property('handler').that.deep.equals(foo);
		});

		it('should append handler for existing type', () => {

			inst.on('foo', foo);
			inst.on('foo', bar);
			let evts = events['foo'].map(e=>e.handler);
			expect(evts).to.deep.equals([foo, bar]);
		});

		it('should NOT normalize case', () => {
			inst.on('FOO', foo);
			inst.on('Bar', foo);
			inst.on('baz:baT!', foo);

			expect(events['FOO'][0].handler).to.deep.equal(foo);
			expect(events).to.not.have.property('foo');
			expect(events).to.have.property('Bar');
			expect(events).to.not.have.property('bar');
			expect(events).to.have.property('baz:baT!');
		});
	});

	describe('off()', () => {
		it('should be a function', () => {
			expect(inst)
				.to.have.property('off')
				.that.is.a('function');
		});

		it('should remove handler for type', () => {
			let foo = () => {};
			inst.on('foo', foo);
			inst.off('foo', foo);

			expect(events).to.have.property('foo').that.is.empty;
		});

		it('should NOT normalize case', () => {
			let foo = () => {};
			inst.on('FOO', foo);
			inst.on('Bar', foo);
			inst.on('baz:bat!', foo);

			inst.off('FOO', foo);
			inst.off('Bar', foo);
			inst.off('baz:baT!', foo);

			expect(events).to.have.property('FOO').that.is.empty;
			expect(events).to.not.have.property('foo');
			expect(events).to.have.property('Bar').that.is.empty;
			expect(events).to.not.have.property('bar');
			expect(events).to.have.property('baz:bat!').with.length(1);
		});
	});

	describe('emit()', () => {
		it('should be a function', () => {
			expect(inst)
				.to.have.property('emit')
				.that.is.a('function');
		});

		it('should invoke handler for type', () => {
			let event = { a: 'b' };

			inst.on('foo', (one, two) => {
				expect(one).to.deep.equal(event);
				expect(two).to.equal('foo');
			});

			inst.emit('foo', event);
		});

		it('should NOT ignore case', () => {
			let onFoo = spy(),
				onFOO = spy();
			inst.on('Foo', onFoo);
			inst.on('FOO', onFOO);

			inst.emit('Foo', 'Foo arg');
			inst.emit('FOO', 'FOO arg');

			expect(onFoo).to.have.been.calledOnce.and.calledWith('Foo arg');
			expect(onFOO).to.have.been.calledOnce.and.calledWith('FOO arg');
		});

		it('should invoke * handlers', () => {
			let star = spy(),
				ea = { a: 'a' },
				eb = { b: 'b' };

			inst.on('*',star);

			inst.emit('foo', ea);
			expect(star).to.have.been.calledOnce.and.calledWith(ea, 'foo');
			star.reset();

			inst.emit('bar', eb);
			expect(star).to.have.been.calledOnce.and.calledWith(eb, 'bar');
		});
	});
});
