import { max, min } from 'moment/src/lib/moment/min-max';
import { RandomDouble } from '../random/RandomDouble';
import { MinMaxChecker } from '../util/MinMaxChecker';
import { DoubleLimits } from '../limits/DoubleLimits';
import { ValueType } from '../../util/ValueTypeDetector';
import { RawDataGenerator } from './RawDataGenerator';

/**
 * Double generator.
 * 
 * @author Thiago Delgado Pinto
 */
export class DoubleGenerator implements RawDataGenerator< number > {
	
	public readonly DEFAULT_DELTA: number = 0.01;
	
	private readonly _min: number;
	private readonly _max: number;
	private readonly _delta: number;
	
	/**
	 * Constructor.
	 * 
	 * @param _random	Random generator.
	 * @param min		Minimum value. Optional. Assumes the minimum double if undefined.
	 * @param max		Maximum value. Optional. Assumes the maximum double if undefined.
	 * @param delta		Precision used to generate new values. Optional.
	 * 					Assumes the greatest fractional part between min and max.
	 * 
	 * @throws Error In case of invalid values.
	 */		
	constructor(
		private readonly _random: RandomDouble,
		min?: string,
		max?: string,
		delta?: number
	) {
		const checker = new MinMaxChecker();
		checker.check( min, max, delta ); // may throw Error
	
		this._min = ( undefined === min ) ? DoubleLimits.MIN : Number( min );
		this._max = ( undefined === max ) ? DoubleLimits.MAX : Number( max );
		
		this._delta = ( undefined === delta )
			? checker.greatestFractionalPart( this.DEFAULT_DELTA, min, max )
			: delta;
	}
	
	public delta(): number {
		return this._delta;
	}

	public diff(): number {
		return this._max - this._min;
	}

	public hasValuesBetweenMinAndMax(): boolean {
		return this.diff() > this.delta();
	}

	public hasValuesBelowMin(): boolean {
		return this._min > DoubleLimits.MIN;
	}

	public hasValuesAboveMax(): boolean {
		return this._max < DoubleLimits.MAX;
	}	

	// DATA GENERATION

	/** @inheritDoc */
	public lowest(): number {
		return DoubleLimits.MIN;
	}

    /** @inheritDoc */
	public randomBelowMin(): number {
		return ( this.hasValuesBelowMin() )
			? this._random.before( this._min, this._delta )
			: this.lowest();
	}

    /** @inheritDoc */
	public justBelowMin(): number {
		return ( this.hasValuesBelowMin() )
			? this._min - this._delta
			: this.lowest();
	}	

    /** @inheritDoc */
	public min(): number {
		return this._min;
	}

    /** @inheritDoc */
	public justAboveMin(): number {
		return ( this.hasValuesBetweenMinAndMax() )
			? this._min + this._delta
			: this._min;
	}

    /** @inheritDoc */
    public zero(): number {
        return 0;
    }

    /** @inheritDoc */
	public median(): number {
		return this._min + ( this.diff() / 2 );
	}

    /** @inheritDoc */
	public randomBetweenMinAndMax(): number {
        return this.hasValuesBetweenMinAndMax()
            ? this._random.between( this._min + 1, this._max - 1 )
            : this._min;
	}

    /** @inheritDoc */
    public justBelowMax(): number {
        return this.hasValuesBetweenMinAndMax()
            ? this._max - this._delta
            : this._max;
	}
	
    /** @inheritDoc */
	public max(): number {
		return this._max;
	}

    /** @inheritDoc */
    public justAboveMax(): number {
        return this.hasValuesAboveMax()
            ? this._max + this._delta
            : this.greatest()
	}	

    /** @inheritDoc */
	public randomAboveMax(): number {
		return this.hasValuesAboveMax()
			? this._random.after( this._max, this._delta )
			: this.greatest();
	}

	/** @inheritDoc */
	public greatest(): number {
		return DoubleLimits.MAX;
	}

}