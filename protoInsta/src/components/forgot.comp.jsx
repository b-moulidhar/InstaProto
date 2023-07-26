function ForgetPass(){

    return(
        <div class="container h-100">
    		<div class="row h-100">
				<div class="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
					<div class="d-table-cell align-middle">

						<div class="text-center mt-4">
							<h1 class="h2">Reset password</h1>
							<p class="lead">
								Enter your phone Number to reset your password.
							</p>
						</div>

						<div class="card">
							<div class="card-body">
								<div class="m-sm-4">
									<form>
										<div class="form-group">
											<label>Phone</label>
											<input class="form-control form-control-lg" type="text" name="phNum" placeholder="Enter your mobile number"/>
										</div>
										<div class="text-center mt-3">
											<button type="submit" class="btn btn-lg btn-primary">Reset password</button>&nbsp; &nbsp;
											<a href="/" class="btn btn-lg btn-primary">Back to Login</a>
										</div>
									</form>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
    )
}
export default ForgetPass;